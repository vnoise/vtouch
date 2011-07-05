var Clip = new Class({
    Extends: Button,

    initialize: function(options) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this._state = 0;
        this.bgColor = '#3a3637';
        this._color = '#3a3637';
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
        //this.drawBackground(context, this._state == 0 ? this.bgColor : this._color);
        this.drawBackground(context, this._color);
        this.drawLabel(context);

        if (this._state == 2){
            context.fillStyle = "rgba(255,255,255,0.5)";
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
        //console.log("sdksdkjsdjksjdksjdksdjksdjskd");
        
        //this.listen('/live/device/param', this.onDeviceParam.bind(this));
        this.listen('/live/name/track', this.onLiveName.bind(this));
        this.listen("/live/clip/info", this.onClipInfo.bind(this));
        this.listen("/live/name/clip", this.onClipName.bind(this));
        this.listen("/live/clip/position", this.onClipPosition.bind(this))
      
        this.xOffset = 0;
        this.yOffset = 0;
        this.cols = 16;
        this.rows = 8;
        
        this.names = [];
        this.matrix = [];
        
        for (var x = 0; x < this.cols; x++) {
            this.matrix[x] = [];
            this.names[x] = this.add({
                type: Button,
                borderWidth: 0,
                bgColor: '#11'
            });
            for (var y = 0; y < this.rows; y++) {
                this.matrix[x][y] = this.add({
                    type: Clip,
                    track: x,
                    clip: y,
                    fontSize: 8,
                    bgColor: "#333033",
                    fgColor: "#333033",
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
        var top = this.height * 0.1;

        this.children.each(function(child) {
            child.visible = false;
        });
        
        for (var x = 0; x < 8; x++) {
            var label = this.names[x + this.xOffset];
            label.extent(x * w, 0, w - gap, top - gap);
            label.visible = true;

            for (var y = 0; y < 8; y++) {
                var child = this.matrix[x + this.xOffset][y + this.yOffset];
                child.extent(x * w, y * h + top, w - gap, h - gap);
                child.visible = true;
            }
        }    
    },
    
    onClipPosition: function(track, clip, position, length, loop_start,loop_end){
        this.matrix[track][clip].clipPos(position / length);
    },
    
    //(int track) (int device) (int param) (int value) (str name)
    /*onDeviceParam: function(track, device, parameter,value,name){
      console.log("onDeviceParam: "+track+", "+device+", "+parameter+","+value+","+name);  
    },
    */
    onClipName: function(track, clip, name,color) {
        r = (color >> 16) & 0xff;
        g = (color >> 8) & 0xff;
        b = (color >> 0) & 0xff;
        color =  "rgb("+r+","+g+","+b+")";
        //console.log("onClipName---clipMatrix"+color);
        
        this.matrix[track][clip].clipName(name,color);
    },
        
    onClipInfo: function(track, clip, state) {
        //[state: 0 = no clip, 1 = has clip, 2 = playing, 3 = triggered]
        this.matrix[track][clip].clipInfo(state);
    },

    onLiveName: function(track, name){
        this.names[track].label = name;
    },
    
    requestUpdate: function() {   
        //console.log("request") 
        //this.send("/live/device", "ii", 1, 0);
        ///live/device            (int track, int device, int parameter,          Sets parameter on device on track number track to value
        //                        int value)
        //this.send("/live/device", "iii", 1, 0,2);
        
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

