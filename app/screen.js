var ScreenButton = new Class({
    Extends: Button,

    initialize: function(options) {
        this.active = false;

        Button.prototype.initialize.call(this, options);
    },

    drawCanvas: function(context) {
        this.drawBackground(context, this.active ? this.fgColor : this.bgColor);
        this.drawLabel(context);
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
            fgColor: "#ccc",
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