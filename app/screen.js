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

        this.tabs = this.add({ layout: 'horizontal' });
        this.navi = this.add({ layout: 'vertical' });

        this.navi.add({
            type: Button,
            label: '<',
            marginTop: 5,
            on: {
                click: function() {
                    if (this.clipMatrix.xOffset > 0) {
                        this.clipMatrix.xOffset -= 1;
                    }
                }.bind(this)
            }
        });

        this.navi.add({
            type: Button,
            label: '>',
            marginTop: 5,
            on: {
                click: function() {
                    if (this.clipMatrix.xOffset < 56) {
                        this.clipMatrix.xOffset += 1;
                    }
                }.bind(this)
            }
        });

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
        this.tabs.add({
            type: ScreenButton,
            label: label,
            bgColor: "#333",
            fgColor: "#ccc",
            marginRight: 5,
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
        this.tabs.extent(0, 0, this.width, this.height * 0.1);
        this.tabs.doLayout();
        this.navi.extent(0, this.height * 0.1, this.width * 0.1, this.height * 0.9);
        this.navi.doLayout();

        this.hidePanels();

        this.activePanel.visible = true;
        this.activePanel.extent(this.width * 0.1, this.height * 0.1, this.width * 0.9, this.height * 0.9);
        this.activePanel.doLayout();
    }
    
});