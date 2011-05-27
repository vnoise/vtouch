var SliderPanel = new Class({
    Extends: VTouchWidget,

    initialize: function(options) {
        this.layout = 'horizontal';

        Widget.prototype.initialize.call(this, options);

        for (var i = 0; i < 8; i++) {
            this.add({
                type: Slider,
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

        this.controller.addEvent("/live/volume", this.onLiveVolume.bind(this));
    },

    onLiveVolume: function(track, value) {
        this.children[track].value(value);
    },

    onChange: function(track, value) {
        this.send("/live/volume", "if", track, value)
    }
});