var SendPanel = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.listen('/live/name/track', this.onLiveName.bind(this));
        this.listen('/live/send', this.onLiveSend.bind(this));

        for (var i = 0; i < 8; i++) {
            this.add({
                type: Slider,
                track: i,
                marginRight: 10,
                on: {
                    change: this.onSliderChange.bind(this, i)
                }
            });
        }        
    },
    
    onSliderChange: function(track, value) {
        this.send('/live/send', track, value);
    },

    onLiveName: function(track, name){
        this.children[track].name = name;
    },

    onLiveSend: function(track, send, value){
    }

});
