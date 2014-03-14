define(['app/misc/context', 'backbone', 'underscore'], function (context, Backbone, _) {
    return Backbone.View.extend({
        className: 'levelMeter',
        playing: false,

        initialize: function () {
            this.analyser = context.createAnalyser();
            this.analyser.smoothingTimeConstant = 0.5;
            this.analyser.fftSize = 1024;

            this.jsNode = context.createScriptProcessor(2048, 1, 1);
            this.jsNode.onaudioprocess = this.processAudio.bind(this);
            this.jsNode.connect(context.destination);
            this.analyser.connect(this.jsNode);

            this.track = this.options.track;
            this.track.on('play', this.connect, this);
            this.track.on('stop', this.disconnect, this);
        },

        processAudio: function () {
            if (!this.playing) {
                this.average = 0;
                return;
            }
            var array =  new Uint8Array(512);
            this.analyser.getByteFrequencyData(array);
            this.average = _.reduce(array, function (memo, value) {return memo + value;}) / array.length;
        },

        connect: function () {
            this.playing = true;
            this.track.source.connect(this.analyser);
        },

        disconnect: function () {
            this.playing = false;
            this.analyser.disconnect(0);
        },

        render: function () {
            this.svg = $(
                '<svg width="25" height="100" viewport="0 0 25 100" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
                    '<circle cx="12.5" cy="12.5" r="10" style="fill: red;"></circle>' +
                    '<circle cx="12.5" cy="37.5" r="10" style="fill: red;"></circle>' +
                    '<circle cx="12.5" cy="62.5" r="10" style="fill: red;"></circle>' +
                    '<circle cx="12.5" cy="87.5" r="10" style="fill: red;"></circle>' +
                '</svg>'
            );
            this.$el.append(this.svg);

            function step() {
                requestAnimationFrame(step.bind(this));
                this.updateMeter();
            }

            requestAnimationFrame(step.bind(this));
            return this;
        },

        updateMeter: function () {
            var level = Math.round(this.average/32);
            var circles = this.svg.children('circle');
            circles.each(function (i, circle) {
                circle.style.fill = 3-i <= level ? '#f95' : '#555';
            });
        }
    });
});