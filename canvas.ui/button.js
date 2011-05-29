var Button = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.label = "";
        this.textAlign = "center";
        this.fontColor = "#fff";
        this.fontName = "Arial";
        this.fontSize = 10;

        Widget.prototype.initialize.call(this, options);
    },

    drawBackground: function(context, style) {
        context.fillStyle = style;
        context.fillRect(0, 0, this.width, this.height);
    },

    drawLabel: function(context) {
        context.textAlign = this.textAlign;
        context.fillStyle = this.fontColor;
        context.font = (this.height * this.fontSize / 25) + "px " + this.fontName;
        context.fillText(this.label, this.width / 2, this.height / 2 + this.height * this.fontSize / 100);
    },

    drawCanvas: function(context) {
        this.drawBackground(context, this.bgColor);
        this.drawLabel(context);
    },

    onTouchDown: function(event) {
        this.fireEvent("click");
        return true;
    }

});

var ToggleButton = new Class({
    Extends: Button,

    initialize: function(options) {
        this.state = false;
        Button.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        this.drawBackground(context, this.state ? this.fgColor : this.bgColor);
        this.drawLabel(context);
    },

    onTouchDown: function(event) {
        this.state = ! this.state; 
        this.fireEvent("click", this.state);
        return true;
    }

});

