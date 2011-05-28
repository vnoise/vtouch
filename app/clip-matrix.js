var Clip = new Class({
    Extends: Widget,

    initialize: function(options) {
        this._state = false;
        this._isPlaying = false;
        this._color = "#FF0000";
        this._clipPos = 0;
        this.label = "";

        Widget.prototype.initialize.call(this, options);
    },
    
    state: function(state) {
        if (state === undefined) {
            return this._state;
        }
        else {
            this._state = state;
        }
    },

    drawCanvas: function(context) {
        if (this._state == false){
            context.fillStyle = this.bgColor;
        }else{
            context.fillStyle = this.frontColor;
        }
        context.fillRect(0, 0, this.width(), this.height());
        context.fillStyle = this.labelColor;
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height() - 40, this.width() - 20);
    },

    onTouchDown: function(event) {
        this._state = ! this._state; 
        this.fireEvent("click", this._state);
        return true;
    }

});

var ClipMatrix = new Class({
    Extends: VTouchWidget,

    initialize: function(options) {

        VTouchWidget.prototype.initialize.call(this, options);
		this.controller.addEvent("/live/mute", this.onPlay.bind(this));
		
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

