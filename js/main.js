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
    'app/config', 'app/view/Player', 'app/view/Mixer', 'app/audio/Track', 'app/view/Tracklist', 'app/view/FileList', 'jquery', 'domReady!',
    'app/misc/requestAnimationFramePolyfill'
], function (config, Player, Crossfader, Track, Tracklist, FileList, $) {
    var body = $('body');
    if (!window.chrome) {
        //body.append('<img src="http://cdn.meme.li/instances/300x300/38950801.jpg">');
        //return;
    }

    var trackA = new Track(),
        trackB = new Track();

    var leftPlayer = new Player({
        track: trackA
    });
    var rightPlayer = new Player({
        track: trackB
    });
    var turntables = [leftPlayer, rightPlayer];

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

    body.append(connect);
});