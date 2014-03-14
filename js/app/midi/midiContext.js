define(['app/midi/Midi'], function (Midi) {
    var midi = new Midi();
    midi.on('initialized', function () {
        midi.selectInput(0);
    });
    return midi;
});