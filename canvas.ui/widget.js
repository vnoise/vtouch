var WidgetId = 1;

var Widget = new Class({

    Implements: Events,

    initialize: function(options) {
        this.children = [];
        this.id = WidgetId++;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.visible = true;

        this.marginTop = 0;
        this.marginBottom = 0;
        this.marginLeft = 0;
        this.marginRight = 0;

        this.sizeHint = 1; 
        this.set(options);

        if (!this._parent) {
            this.initCanvas();
        }
    },

    on: function(event, callback) {
        if (callback) {
            this.addEvent(event, callback);
        }
        else {
            for (var name in event) {
                this.addEvent(name, event[name]);               
            }
        }
    },

    onTouchDown: function(event) {
        return false;
    },

    onTouchMove: function(event) {
        return false;
    },

    onTouchUp: function(event) {
        return false;
    },

    doLayout: function() {
        switch (this.layout) {
        case 'horizontal': 
            this.doHorizontalLayout();
            break;
        case 'vertical': 
            this.doVerticalLayout();
            break;
        }

        this.layoutChildren();
    },

    layoutChildren: function() {
        this.children.each(function(child) {
            child.doLayout();
        });
    },

    sumSizeHints: function() {
        var size = 0;

        this.children.each(function(child) {
            size += child.sizeHint;
        });

        return size;
    },

    sumVerticalMargins: function() {
        var margin = 0;

        this.children.each(function(child) {
            margin += child.marginTop + child.marginBottom;
        });

        return margin;
    },

    sumHorizontalMargins: function() {
        var margin = 0;

        this.children.each(function(child) {
            margin += child.marginLeft + child.marginRight;
        });

        return margin;
    },

    doHorizontalLayout: function() {
        var x = 0;
        var y = 0;
        var width = 0;
        var w = (this.width - this.sumHorizontalMargins()) / this.sumSizeHints();
        var h = this.height;

        this.children.each(function(child) {
            x += child.marginLeft;
            child.extent(x, y, w * child.sizeHint, h);
            x += child.width;
            x += child.marginRight;
        });
    },

    doVerticalLayout: function() {
        var x = 0;
        var y = 0;
        var w = this.width;
        var h = (this.height - this.sumVerticalMargins()) / this.sumSizeHints();

        this.children.each(function(child) {
            y += child.marginTop;
            child.extent(x, y, w, h * child.sizeHint);
            y += child.height;
            y += child.marginBottom;
        });
    },

    initCanvas: function() {
        this.canvas = document.createElement('canvas');
        this.touchtracker = new TouchTracker(this);

        document.body.appendChild(this.canvas);

        setInterval(this.draw.bind(this), 50);
    },

    drawCanvas: function(context) {
    },

    draw: function(context) {
        if (!this.visible) {
            return;
        }

        if (context === undefined) {
            this.canvas.setAttribute("width", window.innerWidth);
            this.canvas.setAttribute("height", window.innerHeight);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.doLayout();

            context = this.canvas.getContext("2d");
            context.clearRect(0, 0, this.width, this.height);

            this.drawChildren(context);
        }
        else {
            context.save();
            context.translate(this.x, this.y);

            this.drawCanvas(context);
            this.drawChildren(context);

            context.restore();
        }
    },

    drawChildren: function(context) {
        this.children.each(function(child) {
            child.draw(context);
        });
    },

    redraw: function() {
        this.clear();
        this.draw();
    },

    set: function(options) {
        for (var name in options) {
            if (name == 'type') {
                continue;
            }

            if (typeof(this[name]) == "function") {
                this[name](options[name]);
            } 
            else {
                this[name] = options[name];
            }
        }
    },

    listen: function() {
        this.controller.addEvent.apply(this.controller, arguments);
    },

    send: function() {
        this.controller.send.apply(this.controller, arguments);
    },

    add: function(options) {
        var type = options.type || Widget;

        if (!options.controller) {
            options.controller = this.controller;
        }

        if (!options._parent) {
            options._parent = this;
        }

        var child = new type.prototype.$constructor(options);

        this.children.push(child);

        return child;
    },

    find: function(id) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == id) {
                return i;
            }
        }

        return null;
    },

    remove: function(widget) {
        var index = this.find(widget.id);
        this.children.splice(index, 1);
        widget._parent = null;
    },

    child: function(key) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].key == key) {
                return this.children[i];
            }    
        }
        return null;
    },

    pos: function(x, y) {
        if (x === undefined) {
            return [this.x, this.y];
        }
        else {
            this.x = x;
            this.y = y;
            return this;
        }
    },

    extent: function(x, y, w, h) {
        if (x === undefined) {
            return [this.x, this.y, this.width, this.height]; 
        }
        else {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            return this;
        }
    },

    size: function(w, h) {
        if (w === undefined) {
            return [this.width, this.height];
        }
        else {
            this.width = w;
            this.height = h;
            return this;
        }
    },

    root: function() {
        if (this._parent) {
            return this._parent.root();
        }
        else {
            return this;
        }
    },

    pageX: function() {
        if (this._parent) {
            return this._parent.pageX() + this.x;
        }
        else {
            return this.x;
        }
    },

    pageY: function() {
        if (this._parent) {
            return this._parent.pageY() + this.y;
        }
        else {
            return this.y;
        }
    }

});
