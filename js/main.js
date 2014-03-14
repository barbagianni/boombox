requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

requirejs([
    'app/config', 'app/view/Player', 'app/view/Mixer', 'app/audio/Track', 'app/view/Tracklist', 'app/view/FileList',
    'app/midi/midiContext', 'jquery', 'domReady!', 'app/misc/requestAnimationFramePolyfill'
], function (
    config, Player, Crossfader, Track, Tracklist, FileList, midi, $
) {
    var body = $('body'),
        trackA = new Track(),
        trackB = new Track(),
        leftPlayer = new Player({
            track: trackA
        }),
        rightPlayer = new Player({
            track: trackB
        }),
        turntables = [leftPlayer, rightPlayer];

    turntables.forEach(function(turntable) {
        $('body').append(turntable.render().el);
    });

    function step(now) {
        turntables.forEach(function(turntable) {
            turntable.update(now);
        });
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    leftPlayer.loadTrackFromUrl('sounds/Untitled.mp3', 'tors_o', 'Untitled', 'http://soundcloud.com/tors_o');
    rightPlayer.loadTrackFromUrl('sounds/ShifferTool.mp3', 'tors_o', 'Shiffer Tool', 'http://soundcloud.com/tors_o');

    body.append(new Crossfader({
        trackA: trackA,
        trackB: trackB
    }).render().el);

    body.append(new FileList({
        leftPlayer: leftPlayer,
        rightPlayer: rightPlayer
    }).render().el);

    SC.initialize({
        client_id: config.clientId,
        redirect_uri: config.redirectUrl
    });

    var connect = $('<div class="connect button">Connect to SoundCloud</div>');
    connect.click(function () {
        SC.connect(function () {
            SC.get('/me', function (me) {
                connect.remove();
                var collection = new Backbone.Collection();
                body.append(new Tracklist({
                    leftPlayer: leftPlayer,
                    rightPlayer: rightPlayer,
                    model: collection
                }).render().el);
                SC.get('/users/' + me.id + '/favorites', function (favorites) {
                    collection.add(favorites);
                });
            });
        });
    });

    midi.registerAction('903c62', function () {
        leftPlayer.togglePlayback();
    });

    midi.registerAction('903e62', function () {
        rightPlayer.togglePlayback();
    });

    body.append(connect);
});