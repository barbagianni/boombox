define(['app/misc/AudioContextPolyfill'], function () {
    return window.AudioContext && new window.AudioContext();
});