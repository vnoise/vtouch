var Button = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.label = null;
        this.textAlign = "center";
        this.fontColor = "#fff";
        this.fontName = "Arial";
        this.fontSize = 10;
        this.borderWidth = 2;
        this.borderColor = "rgba(255,255,255,0.5)";

        Widget.prototype.initialize.call(this, options);
    },

    drawBorder: function(context) {
        var w = this.borderWidth / 2;
        context.strokeStyle = this.borderColor;
        context.lineWidth = this.borderWidth;
        context.strokeRect(w, w, this.width - w, this.height - w); 
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

        if (this.label) {
            this.drawLabel(context);
        }

        if (this.borderWidth > 0) {
            this.drawBorder(context);
        }
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

