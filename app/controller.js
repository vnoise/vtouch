var Controller = new Class({

    Implements: Events,

    initialize: function() {        
        this.connect();
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

        var socket = this.socket;
        socket.send(message);
        /*setTimeout(function() {
            socket.send(message);
        }, 1);*/
    },

    connect: function() {
        this.socket = new io.Socket(location.host); 
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('bundle', this.onBundle.bind(this));
        this.socket.on('disconnect', this.onDisconnect.bind(this));
        this.socket.connect();
    },

    onConnect: function() {
        this.root = new Screen({
            controller: this
        });

        // console.log("socket.io connected");
    },

    onMessage: function(message) {
        //console.log("onMessage_Controlle.js");
        if (message.address == "#bundle"){
            console.log("--bundle-----");
            console.log("receive onMessage: addr-> " + message.address + " args-> " + message.args);
        }else{
            //console.log("--message-----");
            //console.log("receive onMessage: addr-> " + message.address + " args-> " + message.args);
        }
        //console.log("-------");
        //console.log("receive onMessage.decode(): addr-> " + message.decode());
        //console.log(decode(message));
            this.fireEvent(message.address, message.args);
    },
        
    onBundle: function(bundle){
        console.log("Bundle")
        /*bundle = OSCBundle()
        bundle.append(print1)
        bundle.append('/foo', (123, 456))
        */
        bundlebinary = bundle.getBinary();
        //hexDump(bundlebinary);
        //print decodeOSC(bundlebinary);
        console.log(decodeOSC(bundlebinary));
    },
    

    onDisconnect: function() {
        // console.log('socket.io disconnected');
    }

});