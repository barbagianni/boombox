define(['app/AudioContextPolyfill'], function () {
    return window.AudioContext && new window.AudioContext();
});