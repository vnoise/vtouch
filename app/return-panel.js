var ReturnPanel = new Class({
    Extends: TrackPanel,

    initialize: function(options) {
        this.messages = {
            volume: '/live/return/volume',
            meter: '/live/return/meter',
            mute: '/live/return/mute',
            solo: '/live/return/solo',
            arm: '/live/return/arm'
        };

        TrackPanel.prototype.initialize.call(this, options);
    }
});
