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

requirejs(['app/config', 'app/Player', 'app/Crossfader', 'app/Track', 'app/Tracklist', 'jquery', 'domReady!', 'app/requestAnimationFramePolyfill'],
    function (config, Player, Crossfader, Track, Tracklist, $) {
    var body = $('body');
    if (!window.chrome) {
        body.append('<img src="http://cdn.meme.li/instances/300x300/38950801.jpg">');
        return;
    }

    var trackA = new Track(),
        trackB = new Track();

    var leftPlayer = new Player({
        track: trackA
    });
    var rightPlayer = new Player({
        track: trackB
    });
    var turntables = [ leftPlayer, rightPlayer];

    turntables.forEach(function(turntable) {
        $('body').append(turntable.render().el);
    });

    function step(now) {
        turntables.forEach(function(turntable) {
            turntable.turn(now);
        });
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    leftPlayer.loadTrack('sounds/Untitled.mp3', 'tors_o', 'Untitled', 'http://soundcloud.com/tors_o');
    rightPlayer.loadTrack('sounds/ShifferTool.mp3', 'tors_o', 'Shiffer Tool', 'http://soundcloud.com/tors_o');

    body.append(new Crossfader({
        trackA: trackA,
        trackB: trackB
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