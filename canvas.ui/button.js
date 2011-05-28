var Label = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.label = "";

        Widget.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        context.fillStyle = this.fontColor;
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height / 2);
    },

    onTouchDown: function(event) {
        this.fireEvent("click");
        return true;
    }

});

var Button = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.state = false;
        this.label = "";

        Widget.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        context.fillStyle = this.state ? this.fgColor : this.bgColor;
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = this.fontColor;
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height / 2);
    },

    onTouchDown: function(event) {
        this.state = ! this.state; 
        this.fireEvent("click", this.state);
        return true;
    }

});

