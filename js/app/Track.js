define(['app/context', 'app/Filter', 'underscore', 'backbone'], function (context, Filter, _, Backbone) {
    /**
     * Abstraction for loading and playing audio through the Web Audio API
     * @class app.Track
     * @constructor
     */
    function Track() {
        _.extend(this, Backbone.Events);

        this.source = null;
        this.currentRequest = null;
        this.buffer = null;
        this.filter = new Filter();
        this.gainNode = context.createGain();
        this.filter.getNode().connect(this.gainNode);
        this.gainNode.connect(context.destination);
    }

    /**
     * Load music into a buffer.
     * @param url {string}
     */
    Track.prototype.load = function (url) {
        var self = this;

        if (this.currentRequest) {
            this.currentRequest.abort();
        }

        this.stop();
        this.source = null;
        this.buffer = null;

        var request = this.currentRequest = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            context.decodeAudioData( request.response, function(buffer) {
                self.currentRequest = null;
                self.buffer = buffer;
                self.trigger('load');
            });
        };
        request.send();
    };

    /**
     * Create a new source for playback and connect it to the sink (filter->gain->destination).
     *
     * Ramps up playback to given speed within one second.
     * @param rate {number}
     */
    Track.prototype.start = function (rate) {
        if (this.buffer) {
            var now = context.currentTime;
            this.source = context.createBufferSource();
            this.source.connect(this.filter.getNode());
            this.source.buffer = this.buffer;
            this.source.playbackRate.setValueAtTime( 0.001, now );
            this.source.playbackRate.linearRampToValueAtTime( rate, now + 1 );
            this.source.noteOn(0);
            this.trigger('play');
        }
    };

    /**
     * Stop playback and disconnect the buffered source.
     */
    Track.prototype.stop = function () {
        if (this.isPlaying()) {
            this.trigger('stop');
            this.source.noteOff(0);
            this.source.disconnect(0);
            this.source = null;
        }
    };

    /**
     * Check for playback.
     * @returns {boolean}
     */
    Track.prototype.isPlaying = function () {
        return !!this.source;
    };

    /**
     * Set the playback rate. A rate of 1 is normal playback.
     * @param rate {number}
     */
    Track.prototype.setPlaybackRate = function (rate) {
        if (this.isPlaying()) {
            this.source.playbackRate.setValueAtTime(rate, context.currentTime);
        }
    };

    /**
     * Set the gain. A gain of 1 is normal volume.
     * @param gain {number}
     */
    Track.prototype.setGain = function (gain) {
        this.gainNode.gain.value = gain;
    };

    /**
     * Get the Filter associated to this Track.
     * @returns {app.Filter}
     */
    Track.prototype.getFilter = function () {
        return this.filter;
    };

    return Track;
});