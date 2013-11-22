define(['backbone'], function (Backbone) {
    var CANVAS_HEIGHT = 50,
        CANVAS_WIDTH = 230;

    return Backbone.View.extend({
        className: 'waveform',
        template: '<div class="position"></div><canvas height="' + CANVAS_HEIGHT +
            '" width="' + CANVAS_WIDTH + '"></canvas>',

        initialize: function (options) {
            var self = this;
            this.track = options.track;
            this.track.on('load', function () {
                self.drawWaveformFromBuffer(this.buffer);
            });
        },

        render: function() {
            this.$el.html(this.template);
            this.canvas = this.$('canvas')[0];
            this.context = this.canvas.getContext('2d');
            // TODO adjust to high DPI screens
            return this;
        },

        updatePosition: function () {
            this.$('.position').css('left',
                this.track.currentPosition() * CANVAS_WIDTH + 'px');
        },

        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        drawWaveformFromBuffer: function (buffer) {
            this.clear();

            var width = this.canvas.width,
                subSamples = 10,
                frameSize = buffer.length / width / subSamples,
                channelData = buffer.getChannelData(0),
                middle = this.canvas.height/2,
                sample;

            this.context.beginPath();
            this.context.moveTo(x, middle);

            for(var x = 0; x <= width * subSamples; x++) {
                sample = channelData[Math.floor(x*frameSize)];
                this.context.lineTo(x / subSamples, (sample * middle) + middle);
            }

            this.context.stroke();
        }
    });
});