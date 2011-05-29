var Clip = new Class({
    Extends: Widget,

    initialize: function(options) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this._state = 0;
        this._color = "#003047";
        this._clipPos = 0;
        this.label = "";

        Widget.prototype.initialize.call(this, options);
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
        if (this._state == 0){
            context.fillStyle = this.bgColor;
        }else{
            context.fillStyle = this._color;
        }
        
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = this.labelColor;
        fontSize = this.height/4;
        context.font = fontSize + "px Helvetica";
        context.fillText(this.label, 2, this.height - this.height/10 , this.width - this.width/10);
        if (this._state == 2){
            context.fillStyle = "rgba(255,255,255,0.5)";
            context.fillRect(0, 0, this.width * this._clipPos, this.height);// Rectangle(pos=pos, size=(w * self.position, h)))
        }
        if (this._state == 2 || this._state == 3 ){
            context.strokeStyle = "rgb(255,255,255)";
            context.lineWidth = 2
            context.strokeRect(0+context.lineWidth/2, 0+context.lineWidth/2, 
                this.width - context.lineWidth, this.height - context.lineWidth);// Rectangle(pos=pos, size=(w * self.position, h)))
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
      
        this._xNavOffset = 0;
        this._yNavOffset = 0;
        
        this.matrix = [];
        
        for (var i = 0; i < 8; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < 8; j++) {
                this.matrix[i][j] = this.add({
                    type: Clip,
                    track: i,
                    clip: j,
                    bgColor: "#003047",
                    frontColor: "#FFFF00",
                    labelColor: "#FFFFFF",
                    marginRight: 10,
                    label: "",
                    on: {
                        click: this.onClick.bind(this)
                    }
                });
            }        
        }
    },
    
    setNavOffsetX: function(offset){
        this._xNavOffset = offset;
    },
    
    setNavOffsetY: function(offset){
        this._yNavOffset = offset;
    },
    
    doLayout: function() {
        var x = 0;
        var y = 0;
        var gap = 10;
        var w = this.width/8 ;
        var h = this.height/8 ;
        
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                //console.log(x,y)
                this.matrix[j][i].extent(j*w, i*h, w, h);
            }
            
        }        
    },
    
    onClipPosition: function(track, clip, position, length, loop_start,loop_end){
        this.matrix[this.getTrack(track)][this.getClip(clip)].clipPos( position / length);
    },
    
    onClipName: function(track, clip, name,color) {
        r = (color >> 16) & 0xff;// / 255;
        g = (color >> 8) & 0xff;
        b = (color >> 0) & 0xff;
        color =  "rgb("+r+","+g+","+b+")";
        this.matrix[this.getTrack(track)][this.getClip(clip)].clipName(name,color);
    },
    
    getTrack: function(track){
        return track - this._xNavOffset;
    },
    
    getClip: function(clip){
        return clip - this._yNavOffset;
    },
        
    onClipInfo: function(track, clip, state) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this.matrix[this.getTrack(track)][this.getClip(clip)].clipInfo(state);
    },
    
    requestUpdate: function()
    {   
       for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                this.send("/live/clip/info", "ii", i + this._xNavOffset, j + this._yNavOffset );
                this.send("/live/name/clip", "ii", i + this._xNavOffset, j + this._yNavOffset );
            }
       }
    },

    onClick: function(track, clip, state) {
        //debugger;
        this.send("/live/play/clipslot", "ii", track, clip) ; 
        
    }
});

