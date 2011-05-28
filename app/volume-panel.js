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
