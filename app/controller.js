var Controller = new Class({

    Implements: Events,

    initialize: function() {
        
        this.connect();
    },
    
    initWidgets: function(){
        this.root = new VTouchWidget({
            controller: this,
            layout: 'horizontal',
        });

        //this.volumePanel = this.root.add({ type: VolumePanel });
        this.clipMatrix = this.root.add({ type: ClipMatrix});
        //this.clipMatrix.x = 200;
        //this.clipMatrix.y = 200;
        
        this.clipMatrix.requestUpdate()
        this.touchtracker = new TouchTracker(this);
        /*this.mutePanel = this.root.add({ type: MuteButtonPanel});
        this.soloPanel = this.root.add({ type: SoloButtonPanel});
        this.armPanel = this.root.add({ type: ArmButtonPanel});
        */
       
        /*this.mutePanel = this.root.add({ 
            type: MuteButton,
            bgColor: "#FF0000",
            frontColor: "#FFFF00",
            labelColor: "#00FF00"
        });
        */
        
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
        this.initWidgets();
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