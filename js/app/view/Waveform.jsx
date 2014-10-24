define(['react'], function (React) {
    var CANVAS_HEIGHT = 50,
        CANVAS_WIDTH = 230;

    var Waveform = React.createClass({
        propTypes: {
            buffer: React.PropTypes.any,
            currentPosition: React.PropTypes.number
        },

        drawWaveformFromBuffer: function () {
            var canvas = this.getDOMNode().querySelector('canvas');
            var context = canvas.getContext('2d');
            var buffer = this.props.buffer;

            context.clearRect(0, 0, canvas.width, canvas.height);

            var width = canvas.width,
                subSamples = 10,
                frameSize = buffer.length / width / subSamples,
                channelData = buffer.getChannelData(0),
                middle = canvas.height/2,
                sample;

            context.beginPath();
            context.moveTo(x, middle);

            for(var x = 0; x <= width * subSamples; x++) {
                sample = channelData[Math.floor(x*frameSize)];
                context.lineTo(x / subSamples, (sample * middle) + middle);
            }

            context.stroke();
        },

        componentDidUpdate: function (prevProps) {
            if (this.props.buffer !== prevProps.buffer) {
                this.drawWaveformFromBuffer();
            }
        },

        componentDidMount: function () {
            if (this.props.buffer) {
                this.drawWaveformFromBuffer();
            }
        },

        render: function () {
            return (
                <div className="waveform">
                    <div className='position' style={{
                        left: this.props.currentPosition * CANVAS_WIDTH + 'px'
                    }}/>
                    <canvas height={CANVAS_HEIGHT} width={CANVAS_WIDTH}></canvas>
                </div>
            );
        }
    });
    return Waveform;
});