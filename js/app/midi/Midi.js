define(['backbone', 'underscore'], function (Backbone, _) {
    var Midi = function () {
        if (!navigator.requestMIDIAccess) {
            console.error('Web MIDI not available!');
        } else {
            this.actions = {};
            var self = this;
            navigator.requestMIDIAccess().then(
                function (midiAccess, midiOptions) {
                    self.setMidiAccess(midiAccess);
                },
                function (error) {
                    console.error('Web MIDI initialization failed!', error);
                }
            );
        }
    };

    Midi.prototype = _.extend({
        selectedIndex: null,
        midiAccess: null,
        actions: null,
        selectInput: function (index) {
            if (this.selectedIndex) {
                this.midiAccess.inputs()[this.selectedIndex].onmidimessage = undefined;
                this.selectedIndex = null;
            }
            // There seems to be a bug in the Web Midi implementation, that will cause the onmidimessage handler
            // to vanish, if theres no reference to the used input...
            window.inputs = this.midiAccess.inputs();
            var input = this.midiAccess.inputs()[index];
            if (!input) {
                console.warn('Midi input #' + index + 'not found!');
                return;
            }
            input.onmidimessage = this.onMessage.bind(this);
            this.selectedIndex = index;
        },
        onMessage: function (event) {
            var data = event.data,
                actionDescriptor = pad(data[0].toString(16), 0, 2) +
                pad(data[1].toString(16), 0, 2) +
                pad(data[2].toString(16), 0, 2),
                action = this.actions[actionDescriptor];
            if (action) {
                action(event);
            }
            console.log('Calling action handler for "' + actionDescriptor + '"');
        },
        registerAction: function (filter, action) {
            this.actions[filter] = action;
        },
        setMidiAccess: function (midiAccess) {

            this.midiAccess = midiAccess;
            this.trigger('initialized');
        }
    }, Backbone.Events);

    function pad(input, padSymbol, length) {
        var output = input;
        while (output.length < length) {
            output = padSymbol + output;
        }
        return output;
    }

    return Midi;
});
