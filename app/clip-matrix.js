var Clip = new Class({
    Extends: Button,

    initialize: function(options) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this._state = 0;
        this._color = "#003047";
        this._clipPos = 0;
        this.label = "";

        Button.prototype.initialize.call(this, options);
    },
    
    clipPos: function(pos){
        this._clipPos = pos;  
    },
    
    clipInfo: function(state) {
        this._state = state;
    },
    
    clipName: function(name,color){
        this.label = name;
        this._color = color;
    },

    drawCanvas: function(context) { 
        this.drawBackground(context, this._state == 0 ? this.bgColor : this._color);
        this.drawLabel(context);

        if (this._state == 2){
            context.fillStyle = "rgba(255,255,255,0.2)";
            context.fillRect(0, 0, this.width * this._clipPos, this.height);
        }

        if (this._state == 2 || this._state == 3 ){
            this.drawBorder(context);
        }
    },

    onTouchDown: function(event) {
        //this._state = ! this._state; 
        this.fireEvent("click", [this.track, this.clip, this._state]);
        return true;
    }

});

var ClipMatrix = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.listen("/live/clip/info", this.onClipInfo.bind(this));
        this.listen("/live/name/clip", this.onClipName.bind(this));
        this.listen("/live/clip/position", this.onClipPosition.bind(this))
      
        this.xOffset = 0;
        this.yOffset = 0;
        this.cols = 16
        this.rows = 16
        
        this.matrix = [];
        
        for (var x = 0; x < this.cols; x++) {
            this.matrix[x] = [];
            for (var y = 0; y < this.rows; y++) {
                this.matrix[x][y] = this.add({
                    type: Clip,
                    track: x,
                    clip: y,
                    fontSize: 8,
                    bgColor: "#003047",
                    fgColor: "#FFFF00",
                    marginRight: 10,
                    label: "",
                    on: {
                        click: this.onClick.bind(this)
                    }
                });
            }        
        }
    },

    doLayout: function() {
        var gap = 5;
        var w = this.width / 8;
        var h = this.height / 8;

        this.children.each(function(child) {
            child.visible = false;
        });
        
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                var child = this.matrix[x + this.xOffset][y + this.yOffset];
                child.extent(x * w + gap , y * h + gap, w - gap, h - gap);
                child.visible = true;
            }
        }    
    },
    
    onClipPosition: function(track, clip, position, length, loop_start,loop_end){
        this.matrix[track][clip].clipPos(position / length);
    },
    
    onClipName: function(track, clip, name,color) {
        r = (color >> 16) & 0xff;
        g = (color >> 8) & 0xff;
        b = (color >> 0) & 0xff;
        color =  "rgb("+r+","+g+","+b+")";
        this.matrix[track][clip].clipName(name,color);
    },
        
    onClipInfo: function(track, clip, state) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this.matrix[track][clip].clipInfo(state);
    },
    
    requestUpdate: function() {   
        for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
                this.send("/live/clip/info", "ii", x, y);
                this.send("/live/name/clip", "ii", x, y);
            }
       }
    },

    onClick: function(track, clip, state) {
        this.send("/live/play/clipslot", "ii", track, clip) ; 
        
    }
});

