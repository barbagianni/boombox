define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        className: 'waveform',
        template: '<canvas height="50" width="230"></canvas>',

        initialize: function (options) {
            var self = this;
            options.track.on('load', function () {
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

        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        drawWaveformFromBuffer: function (buffer) {
            this.clear();

            var width = this.canvas.width,
                subSamples = 10,
                frameSize = buffer.length / width / subSamples,
                channelData = buffer.getChannelData(0),
                ctx = this.context,
                middle = this.canvas.height/2,
                sample;

            ctx.beginPath();
            ctx.moveTo(x, middle);

            for(var x = 0; x <= width * subSamples; x++) {
                sample = channelData[Math.floor(x*frameSize)];
                ctx.lineTo(x / subSamples, (sample * middle) + middle);
            }

            ctx.stroke();
        }
    });
});