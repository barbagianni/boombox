define(['jsx!app/view/Waveform', 'underscore', 'backbone', 'react'], function (Waveform, _, Backbone, React) {

    var Platter = React.createClass({
        propTypes: {
            rotation: React.PropTypes.number.isRequired
        },
        render: function () {
            return (
                <div className='plate'>
                    <div className='ring' style={{
                        '-webkit-transform': 'rotate(' + this.props.rotation + 'rad)'
                    }}>
                        <div className='ring'>
                            <div className='ring'>
                                <div className='logo'> ___<br/>{'{'}o,o{'}'}<br/>|)__)<br/>-"-"-</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });

    var Slider = React.createClass({
        propTypes: {
            onUpdate: React.PropTypes.func.isRequired,
            initial: React.PropTypes.number
        },

        getInitialState: function () {
            var initial = this.props.initial;
            return {
                value: typeof initial === 'number' ? initial : 33
            };
        },

        handleChange: function (value) {
            this.setState({ value: value });
            this.props.onUpdate(value);
        },

        render: function () {
            return (
                <input type='range' min={20} max={45} defaultValue={this.state.value} step={0.1}
                    onChange={this.props.onUpdate}/>
            );
        }
    });

    return Backbone.View.extend({
        className: 'player',

        trackTemplate: _.template('<a href="<%-backLink%>"><%-trackName%></a>'),

        template: _.template(
                '<div class="wf"></div>' +
                '<div class="platter"></div>' +
                '</div>' +
                '<span class="pitch">Pitch</span>' +
                '<div class="pitchFader"></div>' +
                '<div class="trackName"></div>' +
                '<div class="artist"></div>' +
                '<span class="play">&#9654;</span>'
        ),

        rpm: 33,
        lastTime: null,
        rotation: 0,
        wheelActive: false,

        events: {
            'click .play': 'togglePlayback'
        },

        initialize: function (options) {
            this.lastTime = new Date();
            this.track = options.track;
            this.track.on('play', function () {
                this.lastTime = null;
            }, this);
            this.track.on('load', function () {
                this.$el.removeClass('disabled');
                React.renderComponent(<Waveform currentPosition={this.track.currentPosition()}
                        buffer={this.track.buffer}/>,
                    this.$('.wf')[0]);
            }, this);
        },

        render: function () {
            this.$el.append(this.template());
            React.renderComponent(<Waveform currentPosition={0} buffer={this.track.buffer}/>, this.$('.wf')[0]);
            React.renderComponent(<Platter rotation={0}/>, this.$('.platter')[0]);
            React.renderComponent(<Slider initial={this.rpm} onUpdate={this.setSpeed.bind(this)}/>,
                this.$('.pitchFader')[0]);
            return this;
        },

        setSpeed: function (eventOrVal) {
            var val = typeof eventOrVal === 'object' ? parseFloat(eventOrVal.target.value) : eventOrVal;
            if (typeof val === 'number') {
                this.rpm = val;
            } else {
                val = this.rpm;
            }
            this.track.setPlaybackRate(val/33);
        },

        wheel: function (amount, pushed) {
            if (amount !== 0 || pushed || this.wheelActive) {
                this.setSpeed((pushed ? 0 : this.rpm / 33) + amount);
                this.wheelActive = true;
            }
            if (!amount && !pushed) {
                this.wheelActive = false;
                this.setSpeed();
            }
        },

        update: function (now) {
            if (!this.track.isPlaying()) return;
            if (!this.lastTime) {
                this.lastTime = now;
                return;
            }
            this.rotation += this.rpm * 2 * Math.PI * (now - this.lastTime) / 60000;
            this.lastTime = now;
            React.renderComponent(<Waveform currentPosition={this.track.currentPosition()}
                buffer={this.track.buffer}/>, this.$('.wf')[0]);
            React.renderComponent(<Platter rotation={this.rotation}/>, this.$('.platter')[0]);
        },

        loadTrackFromUrl: function (url, artist, trackName, backLink) {
            this.track.loadFromUrl(url);
            this.$el.find('.trackName').html(this.trackTemplate({
                trackName: trackName,
                backLink: backLink
            }));
            this.$el.find('.artist').text(artist);
            this.$el.addClass('disabled');
        },

        loadTrackFromFile: function (file) {
            this.track.loadFromFile(file);
            this.$el.find('.trackName').html(this.trackTemplate({
                trackName: file.name,
                backLink: ''
            }));
            this.$el.find('.artist').text('');
            this.$el.addClass('disabled');
        },

        togglePlayback: function () {
            if (this.track.isPlaying()) {
                this.track.stop();
            } else if (!this.track.wasPlaying()) {
                this.track.start();
                this.setSpeed();
            } else {
                this.track.resume();
                this.setSpeed();
            }
        }
    });
});