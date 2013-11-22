define(['app/audio/Track'], function (Track) {
    describe('Track', function () {

        it('plays a track', function () {
            var track, hasLoaded;

            track = new Track();
            hasLoaded = false;
            track.loadFromUrl('../sounds/Untitled.mp3');
            track.on('load', function () {
                hasLoaded = true;
            });

            waitsFor(function () {
                return hasLoaded;
            }, 'track did not load', 5000);

            runs(function () {
                expect(track.isPlaying()).toBe(false);
                track.start();
                expect(track.isPlaying()).toBe(true);
                track.stop();
                expect(track.isPlaying()).toBe(false);
            });
        });

        it('doesn\'t start playback while loading', function () {
            var track = new Track();
            track.loadFromUrl('../sounds/Untitled.mp3');
            expect(track.isPlaying()).toBe(false);
            track.start();
            expect(track.isPlaying()).toBe(false);
        });
    });
});