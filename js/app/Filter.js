define(['app/context', 'backbone'], function (context, Backbone) {
    return Backbone.View({
        className: 'filter',

        events: {
            'change input[name="frequency"]': 'adjustFrequency',
            'change input[name="quality"]': 'adjustQuality'
        },

        render: function () {
            this.frequencySlider = $('<input type="range" name="frequency" min="40">');
            this.frequencySlider.attr('max', context.sampleRate/2);
            this.qualitySlider = $('<input type="range" name="quality">');
            this.$el.append(this.frequencySlider);
            this.$el.append(this.qualitySlider);
        },

        adjustFrequency: function() {
            var frequency = this.frequencySlider.val();
        },

        adjustQuality: function() {
            var quality = this.qualitySlider.val();
        }
    });
});