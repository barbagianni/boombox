define(['app/config', 'backbone', 'underscore'], function (config, Backbone, _) {
    return Backbone.View.extend({
        className: 'trackList',
        trackTemplate: _.template(
            '<div class="track">' +
                '<span class="left">left</span> ' +
                '<span class="right">right</span> ' +
                '<%-title%>' +
            '</div>'
        ),

        events: {
            'click .left': 'playLeft',
            'click .right': 'playRight'
        },

        initialize: function () {
            this.model.on('add', this.addItem, this);
            this.left = this.options.leftPlayer;
            this.right = this.options.rightPlayer;
        },

        addItem: function (item) {
            var trackData = item.toJSON();
            var track = $(this.trackTemplate(trackData));
            track.data(trackData);
            this.$el.append(track);
        },

        render: function () {
            this.$el.html('<div class="title">Your <a href="http://www.soundcloud.com">SoundCloud</a> favorites</div>');
            this.model.each(this.addItem, this);
            return this;
        },

        playLeft: function (event) {
            var trackData = $(event.target.parentNode).data();
            var url = trackData.stream_url + '?client_id=' + config.clientId;
            var trackName = trackData.title;
            var artist = trackData.user.username;
            var backLink = trackData.permalink_url;
            this.left.loadTrackFromUrl(url, artist, trackName, backLink);
        },

        playRight: function (event) {
            var trackData = $(event.target.parentNode).data();
            var url = trackData.stream_url + '?client_id=' + config.clientId;
            var trackName = trackData.title;
            var artist = trackData.user.username;
            var backLink = trackData.permalink_url;
            this.right.loadTrackFromUrl(url, artist, trackName, backLink);
        }
    });
});