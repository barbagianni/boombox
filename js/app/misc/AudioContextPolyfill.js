define(function () {
    window.AudioContext = window.AudioContext ||
        window.webkitAudioContext;

    if (window.AudioContext && !window.AudioContext.prototype.createGain) {
        window.AudioContext.prototype.createGain = window.AudioContext.prototype.createGainNode;
    }
});