var ButtonPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.layout = 'horizontal';

        Widget.prototype.initialize.call(this, options);
        this.listen(this.address, this.onStateChange.bind(this));
        
        for (var i = 0; i < 8; i++) {
            this.add({
                type: Button,
                bgColor: this.bgColor,
                frontColor: this.fgColor,
                labelColor: this.labelColor,
                marginRight: 10,
                label: i + 1,
                on: {
                    click: this.onClick.bind(this, i)
                }
            });
        }        
    },
    
    onStateChange: function(track, state) {
        this.children[track].state(state);
    },

    onClick: function(track, state) {
        this.send(this.address, "ii", track, state ? 1 : 0)
    }
});

var MuteButtonPanel = new Class({
    Extends: ButtonPanel,

    initialize: function(options) {
        this.address = "/live/mute";
        this.bgColor = "#300";
        this.fgColor = "#600";
        this.labelColor = "#fff";

        ButtonPanel.prototype.initialize.call(this, options);
    }
});

var SoloButtonPanel = new Class({
    Extends: ButtonPanel,

    initialize: function(options) {
        this.address = "/live/solo";
        this.bgColor = "#030";
        this.fgColor = "#060";
        this.labelColor = "#fff";

        ButtonPanel.prototype.initialize.call(this, options);
    }
});

var ArmButtonPanel = new Class({
    Extends: ButtonPanel,

    initialize: function(options) {
        this.address = "/live/arm";
        this.bgColor = "#003";
        this.fgColor = "#006";
        this.labelColor = "#fff";

        ButtonPanel.prototype.initialize.call(this, options);
    }
});
