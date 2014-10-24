define(['jsx!../../js/app/view/Player', 'app/audio/Track'], function (Player, Track) {
    describe('Player', function () {
        var track, player, canvas, hasLoaded;

        beforeEach(function () {
            track = new Track();
            player = new Player({
                track: track
            });
            track.loadFromUrl('../sounds/Untitled.mp3');

            hasLoaded = false;
            track.on('load', function () {hasLoaded = true;});

            canvas = $('<div id="canvas"></div>');
            $('body').append(canvas);

            canvas.append(player.render().el);

            waitsFor(function () {
                return hasLoaded;
            }, 5000);
        });

        afterEach(function () {
            canvas.remove();
        });

        it('toggles playback', function () {
            expect(track.isPlaying()).toBe(false);
            player.togglePlayback();
            expect(track.isPlaying()).toBe(true);
            player.togglePlayback();
            expect(track.isPlaying()).toBe(false);
        });
    });
});