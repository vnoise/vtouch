var ScreenButton = new Class({
    Extends: Widget,

    initialize: function(options) {
        this.active = false;
        this.label = "";

        Widget.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        context.fillStyle = this.active ? this.activeColor : this.bgColor;
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = this.labelColor;
        context.font = "20px Helvetica";
        context.fillText(this.label, 2, this.height - 40, this.width - 20);
    },

    onTouchDown: function(event) {
        this._parent.children.each(function(button) {
            button.active = false
        });
        this.active = true;
        this.fireEvent("click");
        return true;
    }

});

var Screen = new Class({
    Extends: Widget,

    initialize: function(options) {
        Widget.prototype.initialize.call(this, options);

        this.buttons = this.add({ layout: 'horizontal' });

        this.clipMatrix = this.add({ type: ClipMatrix});
        this.volumePanel = this.add({ type: VolumePanel });        

        this.panels = [];
        this.addPanel("Clip", this.clipMatrix);
        this.addPanel("Volume", this.volumePanel);

        this.activePanel = this.clipMatrix;

        this.clipMatrix.requestUpdate();
    },

    addPanel: function(label, panel) {
        this.panels.push(panel);
        this.buttons.add({
            type: ScreenButton,
            label: label,
            bgColor: "#333",
            activeColor: "#ccc",
            labelColor: "#999",
            marginRight: 10,
            on: {
                click: this.onClickButton.bind(this, panel)
            }
        });
    },

    onClickButton: function(panel) {
        this.activePanel = panel;
    },

    hidePanels: function() {
        this.panels.each(function(panel) {
            panel.visible = false;
        });
    },      

    doLayout: function() {
        this.buttons.extent(0, 0, this.width, this.height * 0.1);
        this.buttons.doLayout();
        this.hidePanels();
        this.activePanel.visible = true;        
        this.activePanel.extent(0, this.height * 0.1, this.width, this.height * 0.9);
        this.activePanel.doLayout();
    }
    
});