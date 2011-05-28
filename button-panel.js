var MuteButtonPanel = new Class({
    Extends: VTouchWidget,

    initialize: function(options) {
        this.layout = 'horizontal';

        VTouchWidget.prototype.initialize.call(this, options);
		this.controller.addEvent("/live/mute", this.onMuteState.bind(this));
		
        for (var i = 0; i < 8; i++) {
            this.add({
                type: Button,
                bgColor: "#FF0000",
            	frontColor: "#FFFF00",
            	labelColor: "#00FF00",
                marginRight: 10,
                label: i + 1,
                on: {
                    click: this.onClick.bind(this, i)
                }
            });
        }        
    },
    
    onMuteState: function(track, state) {
        this.children[track].state(state);
    },

    onClick: function(track, state) {
        this.send("/live/mute", "ii", track, state ? 1 : 0)
    }
});

var SoloButtonPanel = new Class({
    Extends: VTouchWidget,

    initialize: function(options) {
        this.layout = 'horizontal';

        VTouchWidget.prototype.initialize.call(this, options);
		this.controller.addEvent("/live/solo", this.onMuteState.bind(this));
		
        for (var i = 0; i < 8; i++) {
            this.add({
                type: Button,
                bgColor: "#FF00",
            	frontColor: "#00FFFF",
            	labelColor: "#00FFFF",
                marginRight: 10,
                label: i + 1,
                on: {
                    click: this.onClick.bind(this, i)
                }
            });
        }        
    },
    
    onMuteState: function(track, state) {
        this.children[track].state(state);
    },

    onClick: function(track, state) {
        this.send("/live/solo", "ii", track, state ? 1 : 0)
    }
});

var ArmButtonPanel = new Class({
    Extends: VTouchWidget,

    initialize: function(options) {
        this.layout = 'horizontal';

        VTouchWidget.prototype.initialize.call(this, options);
		this.controller.addEvent("/live/arm", this.onMuteState.bind(this));
		
        for (var i = 0; i < 8; i++) {
            this.add({
                type: Button,
                bgColor: "#0000FF",
            	frontColor: "#FF00FF",
            	labelColor: "#FFFFFF",
                marginRight: 10,
                label: i + 1,
                on: {
                    click: this.onClick.bind(this, i)
                }
            });
        }        
    },
    
    onMuteState: function(track, state) {
        this.children[track].state(state);
    },

    onClick: function(track, state) {
        this.send("/live/arm", "ii", track, state ? 1 : 0)
    }
});

