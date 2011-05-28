var VTouchSlider = new Class({
    Extends: Slider,

    initialize: function(options) {
        this.levelValue = 0;

        Slider.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        Slider.prototype.drawCanvas.call(this, context);

        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(0, this.height, this.width, (this.height * this.levelValue) * -1);
         
    }
});

var SliderPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.layout = 'horizontal';

        Widget.prototype.initialize.call(this, options);

        for (var i = 0; i < 8; i++) {
            this.add({
                type: VTouchSlider,
                marginRight: 10,
                label: i + 1,
                on: {
                    change: this.onChange.bind(this, i)
                }
            });
        }        
    }
});


var VolumePanel = new Class({
    Extends: SliderPanel,

    initialize: function(options) {
        SliderPanel.prototype.initialize.call(this, options);

        if (this.volMessage === undefined || this.levelMessage === undefined) {
            throw "messages undefined";
        }

        this.listen(this.volMessage, this.onLiveVolume.bind(this));
        this.listen(this.levelMessage, this.onTrackMeter.bind(this))
    },

    onTrackMeter: function(track, pan, value){
        this.children[track].levelValue = value;
    },

    onLiveVolume: function(track, value) {
        this.children[track].value(value);
    },

    onChange: function(track, value) {
        this.send(this.volMessage, "if", track, value)
    }
});

var TrackPanel = new Class({
    Extends: VolumePanel,

    initialize: function(options) {
        this.volMessage = "/live/volume";
        this.levelMessage = "/live/track/meter";

        VolumePanel.prototype.initialize.call(this, options);
    }
});

var ReturnPanel = new Class({
    Extends: VolumePanel,

    initialize: function(options) {
        this.volMessage = "/live/return/volume";
        this.levelMessage = "/live/return/meter";

        VolumePanel.prototype.initialize.call(this, options);
    }
});