define(['backbone'], function (Backbone) {

    return Backbone.View.extend({
        className: 'filter',
        template: '<span class="frequency">Hz</span><span class="quality">Q</span>',

        events: {
            'change input[name="frequency"]': 'adjustFrequency',
            'change input[name="quality"]': 'adjustQuality'
        },

        initialize: function (options) {
            this.filter = options.filter;
        },

        render: function () {
            this.$el.html(this.template);
            this.frequencySlider = $('<input type="range" name="frequency" min="0" max="1" step="0.01" value="1">');
            this.qualitySlider = $('<input type="range" name="quality" min="0" max="1" step="0.01" value="0">');
            this.$el.append(this.frequencySlider);
            this.$el.append(this.qualitySlider);
            return this;
        },

        adjustFrequency: function() {
            var frequency = this.frequencySlider.val();
            this.filter.setFrequency(parseFloat(frequency));
        },

        adjustQuality: function() {
            var quality = this.qualitySlider.val();
            this.filter.setQuality(parseFloat(quality));
        }
    });
});