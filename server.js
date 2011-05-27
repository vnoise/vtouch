var sys    = require("sys");
var fs     = require('fs');
var http   = require("http");
var events = require('events');
var io     = require('./Socket.IO-node/lib/socket.io');
var osc    = require('./node-osc/lib/osc');
var _osc   = require('./osc/osc');


Function.prototype.bind = function(object) {
    var fn = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        return fn.apply(object, args.concat(Array.prototype.slice.call(arguments, 0)));
    };
};


function index(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile("index.html", function(err, file) {
        res.end(file);
    });
}

function file(req, res) {
    var type = 'text/plain';

    if (req.url.match(/\.html$/)) {
        type = 'text/html';
    }

    if (req.url.match(/\.js$/)) {
        type = 'text/javascript';
    }

    if (req.url.match(/\.css$/)) {
        type = 'text/css';
    }

    res.writeHead(200, {'Content-Type': type});
    fs.readFile(req.url.slice(1), function(err, file) {
        res.end(file);
    });
}


var routes = [
    [/^$/, index],
    [/.*/, file]
];

function controller(req, res) {
    sys.puts(req.url);

    for (var i = 0; i < routes.length; i++) {
        if (req.url.slice(1).match(routes[i][0])) {
            routes[i][1](req, res);
            return;
        }
    }
}

var server = http.createServer(controller);

server.listen(80, "0.0.0.0");

var io = io.listen(server);

io.on('connection', function(client) {
    var server = new osc.Server(9001, '0.0.0.0');
    var oscClient = new _osc.Client(9000, '127.0.0.1');
    
    server.on('message', function(message) {
        // console.log(message);

        client.send({ 
            address: message[0],
            args: message.slice(1)
        });
    });

    client.on('message', function(message) {
        var types = message.types;
        var args = message.args;
        var msg = new _osc.Message(message.address);

        if (args.length != types.length) {
            console.log("warning: args.length != types.length");
        }

        for (var i in args) {
            msg.append(args[i], types[i]);
        }

        console.log(message);

        oscClient.send(msg);
    });

    client.on('disconnect', function(){
        console.log("client disconnected");
    });
});
