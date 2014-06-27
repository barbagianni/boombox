requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        midi: 'webmidi/Midi',
        backbone: 'backbone/backbone',
        underscore: 'underscore/underscore',
        jquery: 'jquery/dist/jquery',
        domReady: 'requirejs-domready/domReady'
    }
});

requirejs([
    'app/config', 'app/view/Player', 'app/view/Mixer', 'app/audio/Track', 'app/view/Tracklist', 'app/view/FileList',
    'app/midi/midiContext', 'jquery', 'domReady!', 'app/misc/requestAnimationFramePolyfill'
], function (
    config, Player, Crossfader, Track, Tracklist, FileList, midiContext, $
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

    midiContext.registerAction('903c62', function () {
        leftPlayer.togglePlayback();
    });

    midiContext.registerAction('903e62', function () {
        rightPlayer.togglePlayback();
    });

    var wheelA = 0,
        wheelB = 0,
        wheelApushed = false,
        wheelBpushed = false;
    midiContext.registerAction('b00201', function () {
        wheelA += wheelApushed ? 0.1 : 0.05;
    });
    midiContext.registerAction('b10201', function () {
        wheelB += wheelBpushed ? 0.1 : 0.05;
    });
    midiContext.registerAction('b0027f', function () {
        wheelA -= wheelApushed ? 0.1 : 0.05;
    });
    midiContext.registerAction('b1027f', function () {
        wheelB -= wheelBpushed ? 0.1 : 0.05;
    });
    midiContext.registerAction('b0037f', function () {
        wheelApushed = true;
    });
    midiContext.registerAction('b1037f', function () {
        wheelBpushed = true;
    });
    midiContext.registerAction('b00300', function () {
        wheelApushed = false;
    });
    midiContext.registerAction('b10300', function () {
        wheelBpushed = false;
    });

    function wheely() {
        leftPlayer.wheel(wheelA, wheelApushed);
        rightPlayer.wheel(wheelB, wheelBpushed);
        wheelA = 0;
        wheelB = 0;
        setTimeout(wheely, 50);
    }
    wheely();

    body.append(connect);
});