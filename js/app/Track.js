define(['app/context', 'underscore', 'backbone'], function (context, _, Backbone) {
    function Track() {
        _.extend(this, Backbone.Events);

        this.source = null;
        this.buffer = null;
        this.gainNode = context.createGain();
        this.gainNode.connect(context.destination);
    }

    Track.prototype.load = function (url) {
        var self = this;

        this.stop();
        this.source = null;
        this.buffer = null;

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = function() {
            context.decodeAudioData( request.response, function(buffer) {
                self.buffer = buffer;
                self.trigger('load');
            });
        };
        request.send();
    };

    Track.prototype.start = function (rate) {
        if (this.buffer) {
            var now = context.currentTime;
            this.source = context.createBufferSource();
            this.source.connect(this.gainNode);
            this.source.buffer = this.buffer;
            this.source.playbackRate.setValueAtTime( 0.001, now );
            this.source.playbackRate.linearRampToValueAtTime( rate, now + 1 );
            this.source.noteOn(0);
            this.trigger('play');
        }
    };

    Track.prototype.stop = function () {
        if (this.isPlaying()) {
            this.trigger('stop');
            this.source.noteOff(0);
            this.source.disconnect(0);
            this.source = null;
        }
    };

    Track.prototype.isPlaying = function () {
        return !!this.source;
    };

    Track.prototype.setPlaybackRate = function (rate) {
        if (this.isPlaying()) {
            this.source.playbackRate.setValueAtTime(rate, context.currentTime);
        }
    };

    Track.prototype.setGain = function (gain) {
        this.gainNode.gain.value = gain;
    };

    return Track;
});