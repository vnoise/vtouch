var TrackPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        if (this.messages.name) {
            this.listen(this.messages.name, this.onLiveName.bind(this))
        }

        this.listen(this.messages.volume, this.onLiveVolume.bind(this));
        this.listen(this.messages.meter, this.onLiveMeter.bind(this))
        this.listen(this.messages.mute, this.onLiveMute.bind(this))
        this.listen(this.messages.solo, this.onLiveSolo.bind(this))
        this.listen(this.messages.arm, this.onLiveArm.bind(this))

        this.cols = 16;
        this.xOffset = 0;

        for (var i = 0; i < this.cols; i++) {
            this.add({
                type: Track,
                track: i,
                on: {
                    volume: this.onVolume.bind(this),
                    mute: this.onMute.bind(this),
                    solo: this.onSolo.bind(this),
                    arm: this.onArm.bind(this)
                }
            });
        }        
    },

    doLayout: function() {
        var gap = 5;
        var w = this.width / 8;
        var h = this.height;

        this.children.each(function(child) {
            child.visible = false;
        });

        for (var x = 0; x < 8; x++) {
            var child = this.children[x + this.xOffset];            
            child.visible = true;
            child.extent(x * w, 0, w - gap, h - gap);
            child.doLayout();
        }    
    },

    requestUpdate: function() {
        for (var i = 0; i < this.cols; i++) {
            this.send(this.messages.volume, 'i', i);
            this.send(this.messages.mute, 'i', i);
            this.send(this.messages.solo, 'i', i);
            this.send(this.messages.arm, 'i', i);
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
        this.children[track].mute.state = state ;
    },

    onLiveSolo: function(track, state) {
        this.children[track].solo.state = state;
    },

    onLiveArm: function(track, state) {
        console.log("onLiveÁrm ->", track, state)
        this.children[track].arm.state = state;
    },

    onVolume: function(track, value) {
        this.send(this.messages.volume, "if", track, value)
    },

    onMute: function(track, state) {
        this.send(this.messages.mute, "ii", track, state ? 1 : 0 )
    },

    onSolo: function(track, state) {
        this.send(this.messages.solo, "ii", track, state ? 1 : 0)
    },

    onArm: function(track, state) {
        this.send(this.messages.arm, "ii", track, state ? 1 : 0)
    }
});
