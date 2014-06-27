(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.Midi = factory(root.b);
    }
})(this, function () {
    /**
     * A Web MIDI input mapper.
     *
     * http://www.w3.org/TR/webmidi/
     *
     * @class Midi
     * @constructor
     */
    var Midi = function () {
        this._actions = {};
        if (!navigator.requestMIDIAccess) {
            this._accessPromise = Promise.reject('Web MIDI not available!');
        } else {
            this._accessPromise = navigator.requestMIDIAccess().then(
                function (midiAccess, midiOptions) {
                    this._midiAccess = midiAccess;
                }.bind(this),
                function (error) {
                    console.error('Web MIDI initialization failed!', error);
                }
            );
        }
    };

    Midi.prototype = {
        _selectedIndex: null,
        _midiAccess: null,
        _actions: null,
        _accessPromise: null,

        /**
         * Set the mapper to react (exclusively) to MIDI messages of the given input.
         *
         * @param {number} index
         */
        selectInput: function (index) {
            if (this._selectedIndex !== null) {
                this._midiAccess.inputs()[this._selectedIndex].onmidimessage = undefined;
                this._selectedIndex = null;
            }
            // There seems to be a bug in the Web Midi implementation, that will cause the onmidimessage handler
            // to vanish, if theres no reference to the used input...
            window.inputs = this._midiAccess.inputs();
            var input = this._midiAccess.inputs()[index];
            if (!input) {
                console.warn('Midi input #' + index + ' not found!');
                return;
            }
            input.onmidimessage = this._onMessage.bind(this);
            this._selectedIndex = index;
        },

        _onMessage: function (event) {
            var data = event.data,
                actionDescriptor = pad(data[0].toString(16), 0, 2) +
                    pad(data[1].toString(16), 0, 2) +
                    pad(data[2].toString(16), 0, 2),
                action = this._actions[actionDescriptor];
            if (action) {
                action(event);
            }
            console.log('Calling action handler for "' + actionDescriptor + '"');
        },

        /**
         * Register an action that is executed, if a MIDI message with the given filter pattern is received.
         *
         * The filter pattern is Status and data bytes in hex notation concatenated.
         *
         * http://www.w3.org/TR/webmidi/#midimessageevent-interface
         *
         * @param {string} filter
         * @param {function(MIDIMessageEvent)} action
         */
        registerAction: function (filter, action) {
            this._actions[filter] = action;
        },

        /**
         * Is resolved with the MIDI access object.
         *
         * http://www.w3.org/TR/webmidi/#midiaccess-interface
         *
         * @return {Promise}
         */
        midiAccessPromise: function () {
            return this._accessPromise;
        }
    };

    function pad(input, padSymbol, length) {
        var output = input;
        while (output.length < length) {
            output = padSymbol + output;
        }
        return output;
    }

    return Midi;
});
