var MeterSlider = new Class({
    Extends: Slider,

    initialize: function(options) {
        this.meter = 0;

        Slider.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        Slider.prototype.drawCanvas.call(this, context);

        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(0, this.height, this.width, (this.height * this.meter)*0.6 * -1);
        
    }
});
