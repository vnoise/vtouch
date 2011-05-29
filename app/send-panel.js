var SendPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.xOffset = 0;
        this.yOffset = 0;

        this.listen('/live/name/track', this.onLiveName.bind(this));
        this.listen('/live/send', this.onLiveSend.bind(this));

        this.cols = 16;
        this.sends = 2;
        this.names = [];
        this.matrix = [];
        
        for (var i = 0; i < this.cols; i++) {
            this.names[i] = this.add({
                type: Button,
                borderWidth: 0,
                bgColor: '#11'
            });

            this.matrix[i] = [];
            for (var j = 0; j < this.sends; j++) {
                this.matrix[i][j] = this.add({
                    type: Slider,
                    marginRight: 10,
                    on: {
                        change: this.onSliderChange.bind(this, i, j)
                    }
                });
            }        
        }
    },    

    requestUpdate: function() {
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.sends; j++) {
                this.send('/live/send', 'ii', i, j);
            }
        }       
    },

    doLayout: function() {
        var gap = 5;
        var w = this.width / 8;
        var h = this.height * 0.8 / 2;
        var top = this.height * 0.1;

        this.children.each(function(child) {
            child.visible = false;
        });

        for (var x = 0; x < 8; x++) {
            var label = this.names[x + this.xOffset];
            label.extent(x * w, 0, w - gap, top - gap);
            label.visible = true;
            
            for (var y = 0; y < 2; y++) {
                var child = this.matrix[x + this.xOffset][y + this.yOffset];
                child.extent(x * w, top + y * h, w - gap, h - gap);
                child.visible = true;
            }
        }    
    },
    
    onSliderChange: function(track, send, value) {
        this.send('/live/send', 'iif', track, send, value);
    },

    onLiveName: function(track, name){
        this.names[track].label = name;
    },

    onLiveSend: function(track, send, value){
        this.matrix[track][send].setValueTimed(value);
    }

});
