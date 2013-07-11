define(['app/LevelMeter', 'app/FilterControl', 'backbone'], function (LevelMeter, FilterControl, Backbone) {
    return Backbone.View.extend({
        className: 'crossfader',
        template: '<input type="range" min="0" max="100"><span class="leftPlayer">A</span><span class="rightPlayer">B</span>',
        trackA: null,
        trackB: null,

        initialize: function (options) {
            this.trackA = options.trackA;
            this.trackB = options.trackB;
        },

        events: {
            'change input': 'fade'
        },

        render: function () {
            this.$el.html(this.template);
            this.fader = this.$el.find('input');
            this.fade(); // TODO move setting of initial values to a more appropriate place

            var levelA = new LevelMeter({
                track: this.trackA
            }).render();
            var levelB = new LevelMeter({
                track: this.trackB
            }).render();

            this.$el.append(levelA.el);
            this.$el.append(levelB.el);

            var filterA = new FilterControl({
                filter: this.trackA.getFilter()
            }).render();
            var filterB = new FilterControl({
                filter: this.trackB.getFilter()
            }).render();

            this.$el.append(filterA.el);
            this.$el.append(filterB.el);

            return this;
        },

        fade: function () {
            var value = this.fader.val();
            var normalizedPosition = parseInt(value, 10) / parseInt(100, 10);

            var trackAgain = Math.cos(normalizedPosition * Math.PI/2);
            var trackBgain = Math.cos((1.0 - normalizedPosition) * Math.PI/2);
            this.trackA.setGain(trackAgain);
            this.trackB.setGain(trackBgain);
        }
    });
});