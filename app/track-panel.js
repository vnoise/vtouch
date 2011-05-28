var TrackPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.layout = 'horizontal';

        if (this.messages.name) {
            this.listen(this.messages.name, this.onLiveName.bind(this))
        }

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
        if (this.children[track].lastEventTime + 200 < Number(new Date())) {
            this.children[track].volume.value(value);
        }
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
