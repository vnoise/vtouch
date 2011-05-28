var Controller = new Class({

    Implements: Events,

    initialize: function() {
        this.root = new VTouchWidget({
            canvas: document.getElementById('canvas'),
            controller: this,
            layout: 'horizontal',
            width: 800,
            height: 600
        });

        //this.volumePanel = this.root.add({ type: VolumePanel });
        this.volumePanel = this.root.add({ type: MuteButtonPanel});
        /*this.mutePanel = this.root.add({ 
            type: MuteButton,
            bgColor: "#FF0000",
            frontColor: "#FFFF00",
            labelColor: "#00FF00"
        });
        */
        
        
        this.touchtracker = new TouchTracker(this);
        this.connect();

        setInterval(this.draw.bind(this), 50);
    },

    draw: function() {
        this.root.draw();
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

        console.log("send: ", arguments);

        this.socket.send(message);
    },

    connect: function() {
        this.socket = new io.Socket(location.host); 
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
        this.socket.connect();
    },

    onConnect: function() {
        console.log("socket.io connected");
    },

    onMessage: function(message) {
        console.log("receive: " + message.address + " " + message.args);

        this.fireEvent(message.address, message.args);
    },

    onDisconnect: function() {
        console.log('socket.io disconnected');
    }

});