var Track = new Class({
    Extends: Widget,

    initialize: function(options) {
        Slider.prototype.initialize.call(this, options);

        this.layout = 'vertical';

        this.label = this.add({
            type: Button,
            label: this.name,
            borderWidth: 0,
            bgColor: '#11'         
        });

        this.volume = this.add({
            type: MeterSlider,
            sizeHint: 8,
            marginTop: 10,
            on: {
                change: function(value) {
                    this.fireEvent('volume', [this.track, value]);
                }.bind(this)
            }
        });

        this.mute = this.add({
            type: ToggleButton,
            bgColor: '#ffac00',
            fgColor: '#3a3637',
            fontColor: 'rgba(255,255,255,0.5)',
            marginTop: 10,
            label: this.track,
            on: {
                click: function(state) {
                    this.fireEvent('mute', [this.track, state]);
                }.bind(this)
            }
        });

        this.solo = this.add({
            type: ToggleButton,
            bgColor: '#3a3637',
            fgColor: '#0b9eff',
            fontColor: 'rgba(255,255,255,0.5)',
            marginTop: 10,
            label: 'S',
            on: {
                click: function(state) {
                    this.fireEvent('solo', [this.track, state]);
                }.bind(this)
            }
        });

        this.arm = this.add({
            type: ToggleButton,
            bgColor:  '#3a3637',
            fgColor: '#ff283f',
            fontColor: 'rgba(255,255,255,0.5)',
            label: 'O',
            marginTop: 10,
            on: {
                click: function(state) {
                    this.fireEvent('arm', [this.track, state]);
                }.bind(this)
            }
        });
    }
});
