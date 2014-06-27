define(['midi'], function (Midi) {
    var midi = new Midi();
    midi.midiAccessPromise().then(function () {
        midi.selectInput(0);
    });
    return midi;
});