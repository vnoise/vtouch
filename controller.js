var Controller = new Class({

    initialize: function() {
        this.canvas = document.getElementById('canvas');

        this.root = new Widget({
            layout: 'horizontal',
            width: 800,
            height: 600
        });

        this.root.add({
            type: Slider,
            label: "HAMMER",
            on: {
                change: function(value) {
                    this.send("/live/volume", "if", 0, value)
                }.bind(this)
            }
        });
        
        this.touchtracker = new TouchTracker(this);
        this.connect();

        setInterval(this.draw.bind(this), 50);
    },

    draw: function() {
        var context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.width, this.height);
        this.root.doLayout();
        this.root.draw(context);
    },

    send: function(address, types) {
        var message = {
            address: address,
            args: [],
            types: types
        };

        for (var i = 2; i < arguments.length; i++) {
            message.args.push(arguments[i]);
        }

        if (message.args.length != message.types.length) {
            console.log("warning: args.length != types.length");
        }

        this.socket.send(message);
    },

    connect: function() {
        this.socket = new io.Socket(location.host); 
        this.socket.connect();
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
    },

    onConnect: function() {
    },

    onMessage: function(message) {
        console.log(message);
    },

    onDisconnect: function() {
        console.log('disconnect');
    }

});