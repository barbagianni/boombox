define(['app/context'], function (context) {
    var QUALITY_MULTIPLIER = 30,
        MAX_FREQUENCY = context.sampleRate / 2,
        MIN_FREQUENCY = 40,
        NUMBER_OF_OCTAVES = Math.log(MAX_FREQUENCY / MIN_FREQUENCY) / Math.LN2,
        LOWPASS_FILTER = 0;

    /**
     * @class app.Filter
     * @constructor
     */
    var Filter = function () {
        this.filter = context.createBiquadFilter();
        this.filter.type = LOWPASS_FILTER;
        this.filter.frequency.value = MAX_FREQUENCY;
    };

    Filter.prototype.getNode = function () {
        return this.filter;
    };

    Filter.prototype.setFrequency = function (frequency) {
        var multiplier = Math.pow(2, NUMBER_OF_OCTAVES * (frequency - 1.0));
        this.filter.frequency.value = MAX_FREQUENCY * multiplier;
    };

    Filter.prototype.setQuality = function (quality) {
        this.filter.Q.value = quality * QUALITY_MULTIPLIER;
    };

    Filter.MAX_FREQUENCY = MAX_FREQUENCY;
    Filter.MIN_FREQUENCY = MIN_FREQUENCY;

    return  Filter;
});