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
    
    clipInfo: function(state) {
        //console.log(state)
        this._state = state;
    },
    
    clipName: function(name,color){
        //console.log(name)
        console.log(color)
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
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height - this.height/10 , this.width - this.width/10);
    },

    onTouchDown: function(event) {
        //this._state = ! this._state; 
        this.fireEvent("click", [this.track, this.clip, this._state]);
        return true;
    }

});

var ClipMatrix = new Class({
    Extends: VTouchWidget,

    initialize: function(options) {

        VTouchWidget.prototype.initialize.call(this, options);
        this.controller.addEvent("/live/clip/info", this.onClipInfo.bind(this));
        this.controller.addEvent("/live/name/clip", this.onClipName.bind(this));
      
        
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
    
    onClipName: function(track, clip, name,color) {
        r = (color >> 16) & 0xff;// / 255;
        g = (color >> 8) & 0xff;
        b = (color >> 0) & 0xff;
        color =  "rgb("+r+","+g+","+b+")";
        this.matrix[track][clip].clipName(name,color);
    },
    
    onClipInfo: function(track, clip, state) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this.matrix[track][clip].clipInfo(state);
    },
    
    requestUpdate: function()
    {   
       for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                this.send("/live/clip/info", "ii", i, j);
                this.send("/live/name/clip","ii",i,j);
            }
       }
    },

    onClick: function(track, clip, state) {
        //debugger;
        this.send("/live/play/clipslot", "ii", track, clip) ; 
        
    }
});

