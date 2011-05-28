var MeterSlider = new Class({
    Extends: Slider,

    initialize: function(options) {
        this.meter = 0;

        Slider.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        Slider.prototype.drawCanvas.call(this, context);

        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(0, this.height, this.width, (this.height * this.meter) * -1);
        
    }
});

var Track = new Class({
    Extends: Widget,

    initialize: function(options) {
        Slider.prototype.initialize.call(this, options);

        this.layout = 'vertical';

        this.label = this.add({
            type: Label,
            label: this.name,
            bgColor: '#300'         
        });

        this.volume = this.add({
            type: MeterSlider,
            sizeHint: 4,
            marginTop: 10,
            on: {
                change: function(value) {
                    this.fireEvent('volume', this.track, value);
                }.bind(this)
            }
        });

        this.mute = this.add({
            type: Button,
            bgColor: '#300',
            fgColor: '#900',
            fontColor: 'rgba(255,255,255,0.5)',
            marginTop: 10,
            label: this.track,
            on: {
                click: function(state) {
                    this.fireEvent('mute', this.track, state);
                }.bind(this)
            }
        });

        this.solo = this.add({
            type: Button,
            bgColor: '#030',
            fgColor: '#060',
            fontColor: 'rgba(255,255,255,0.5)',
            marginTop: 10,
            label: 'S',
            on: {
                click: function(state) {
                    this.fireEvent('solo', this.track, state);
                }.bind(this)
            }
        });

        this.arm = this.add({
            type: Button,
            bgColor: '#003',
            fgColor: '#006',
            fontColor: 'rgba(255,255,255,0.5)',
            label: 'O',
            marginTop: 10,
            on: {
                click: function(state) {
                    this.fireEvent('arm', this.track, state);
                }.bind(this)
            }
        });
    }
});


var TrackPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.layout = 'horizontal';

        this.listen(this.messages.name, this.onLiveName.bind(this))
        this.listen(this.messages.volume, this.onLiveVolume.bind(this));
        this.listen(this.messages.meter, this.onLiveMeter.bind(this))
        this.listen(this.messages.mute, this.onLiveMute.bind(this))
        this.listen(this.messages.solo, this.onLiveSolo.bind(this))
        this.listen(this.messages.arm, this.onLiveArm.bind(this))

        for (var i = 0; i < 8; i++) {
            this.add({
                type: Track,
                track: i,
                marginRight: 10,
                on: {
                    volume: this.onVolume.bind(this),
                    mute: this.onMute.bind(this)
                }
            });
        }        
    },

    onLiveName: function(track, name){
        this.children[track].name = name;
    },

    onLiveMeter: function(track, pan, value){
        this.children[track].volume.meter = value;
    },

    onLiveVolume: function(track, value) {
        this.children[track].volume.value(value);
    },

    onLiveMute: function(track, state) {
        this.children[track].mute.state = state;
    },

    onLiveSolo: function(track, state) {
        this.children[track].solo.state = state;
    },

    onLiveArm: function(track, state) {
        this.children[track].arm.state = state;
    },

    onVolume: function(track, value) {
        this.send(this.messages.volume, "if", track, value)
    },

    onMute: function(track, state) {
        this.send(this.messages.mute, "ii", track, value)
    },

    onSolo: function(track, state) {
        this.send(this.messages.solo, "ii", track, value)
    },

    onArm: function(track, state) {
        this.send(this.messages.arm, "ii", track, value)
    }
});


var VolumePanel = new Class({
    Extends: TrackPanel,

    initialize: function(options) {
        this.messages = {
            volume: '/live/volume',
            name: '/live/name/track',
            meter: '/live/track/meter',
            mute: '/live/mute',
            solo: '/live/solo',
            arm: '/live/arm'
        };

        TrackPanel.prototype.initialize.call(this, options);
    }
});

// var ReturnPanel = new Class({
//     Extends: VolumePanel,

//     initialize: function(options) {
//         this.volMessage = "/live/return/volume";
//         this.levelMessage = "/live/return/meter";

//         VolumePanel.prototype.initialize.call(this, options);
//     }
// });