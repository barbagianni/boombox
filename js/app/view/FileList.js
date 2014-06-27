define(['backbone'], function (Backbone) {
    return Backbone.View.extend({
        className: 'fileList',
        trackTemplate: _.template(
            '<div class="track">' +
                '<span class="left">left</span> ' +
                '<span class="right">right</span> ' +
                '<%-title%>' +
                '</div>'
        ),
        template: '<input type="file" multiple>',

        events: {
            'change input': 'onFileSelect',
            'click .left': 'playLeft',
            'click .right': 'playRight'
        },

        initialize: function (options) {
            this.left = options.leftPlayer;
            this.right = options.rightPlayer;
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        onFileSelect: function (event) {
            var files = event.target.files,
                file;

            var trackTemplate = this.trackTemplate;

            var viewBody = this.$el;

            for (var i = 0; i < files.length; i++) {
                file = files[i];
                viewBody.append($(trackTemplate({title: file.name})).data({file: file}));
            }
        },

        playLeft: function (event) {
            var file = $(event.target.parentNode).data('file');
            this.left.loadTrackFromFile(file);
        },

        playRight: function (event) {
            var file = $(event.target.parentNode).data('file');
            this.right.loadTrackFromFile(file);
        }
    });
});