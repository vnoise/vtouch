var TouchTracker = new Class({

    initialize: function(root) {
        this.root = root;
        this.touchModel = null;
        this.touches = {};

        if (window.location.hash == '#touch') {
            if (navigator.userAgent.match(/iPad|iPhone/i)) {
                this.touchModel = "apple";
                this.event = {
                    down: 'touchstart',
                    move: 'touchmove',
                    up: 'touchend'
                };
            }
            else if (navigator.userAgent.match(/Firefox/i)) {
                document.multitouchData = true;
                this.touchModel = "mozilla";
                this.event = {
                    down: 'MozTouchDown',
                    move: 'MozTouchMove',
                    up: 'MozTouchUp'
                };
            }
            else {
                throw "no touch device found";
            }
        }
        else {
            this.touchModel = "mouse";
            this.event = {
                down: 'mousedown',
                move: 'mousemove',
                up: 'mouseup'
            };
        }

        // document.documentElement.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
        // document.documentElement.style.webkitTouchCallout = "none";

        document.onselectstart = function () { return false; };
        document.onselect = function () { return false; };

        document.ongesturechange = function(e) { e.preventDefault(); };
        document.ongesturestart = function(e) { e.preventDefault(); };

        document.addEventListener(this.event.down, this.onTouchDown.bind(this), false);
        document.addEventListener(this.event.move, this.onTouchMove.bind(this), false);
        document.addEventListener(this.event.up, this.onTouchUp.bind(this), false);

        // this.scrollManager = new ScrollManager();
    },

    log: function(str) {
        this.controller.log(str);
    },

    createEvent :function(widget, event) {
        return {
            localX: event.pageX - widget.pageX(),
            localY: event.pageY - widget.pageY()
        };
    },

    eventInside: function(widget, event) {
        var x = event.pageX - widget.pageX();
        var y = event.pageY - widget.pageY();

        return x >= 0 && x <= widget.width && y >= 0 && y <= widget.height;
    },

    findTarget: function(widget, event) {
        if (widget.visible && this.eventInside(widget, event)) {
            for (var i = widget.children.length - 1; i >= 0; i--) {
                var target = this.findTarget(widget.children[i], event);
                if (target) {
                    return target;
                }
            }
            return widget;
        }

        return false;
    },

    bubbleEvent: function(widget, event) {
        if (this.handleEvent(widget, "onTouchDown", event)) { 
            this.touches[event.identifier] = widget;
        }
        else {
            if (widget.parent) {
                this.bubbleEvent(widget, event);
            }
        }
    },

    handleEvent: function(widget, method, event) {
        return widget[method].call(widget, this.createEvent(widget, event));
    },

    findTargetAndBubble: function(event) {
        var target = this.findTarget(this.root, event);

        if (target && target.parent) {
            this.bubbleEvent(target, event);
        }
        else {
            // this.scrollManager.onTouchDown(event);
        }
    },

    foreachTouch: function(event, method) {
        for (var i = 0; i < event.changedTouches.length; i++) {
            this[method].call(this, event.changedTouches[i]);
        }       
    },

    prepareEvent: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        }

        if (!event.streamId === undefined) {
            event.identifier = event.streamId;
        }

        if (event.identifier === undefined) {
            event.identifier = 1;
        }
    },

    onTouchDown: function(event) {
        this.prepareEvent(event);

        if (event.touches) {
            this.foreachTouch(event, 'onTouchDown');
        }
        else {
            this.findTargetAndBubble(event);
        }

        return false;
    },

    onTouchMove: function(event) {
        this.prepareEvent(event);

        if (event.touches) {
            this.foreachTouch(event, 'onTouchMove');
        }
        else {
            var widget = this.touches[event.identifier];

            if (widget) {
                this.handleEvent(widget, "onTouchMove", event);
            }
        }
        return false;
    },

    onTouchUp: function(event) {
        this.prepareEvent(event);

        if (event.touches) {
            this.foreachTouch(event, 'onTouchUp');
        }
        else {
            var widget = this.touches[event.identifier];

            if (widget) {
                this.handleEvent(widget, "onTouchUp", event);
            }

            delete this.touches[event.identifier];
        }
        return false;
    }
});