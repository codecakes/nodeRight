#!/usr/local/bin/node --harmony

"use strict";

const
    clientWatch = function clientWatch (host, port) {
        const
            net = require("net"),
            path = require("path"),
            parseData = require(path.join(__dirname, "/parseData")),
            client = net.connect({
                port: port, 
                host: host,
                allowHalfOpen: true
            }, function connectListen () {
                    console.log("connected to server");
                });
        
        parseData.parseData(client).on('message', function(message) {
                    
                    if (message.type === 'connected') {
                        console.log("Now connected: " + message.message + " " + message.description);
                    } else if (message.type === 'change') {
                        console.log("File '" + message.message + " " + message.description + "' changed at: " + message.date);
                    } else if (message.type === 'rename') {
                        console.log("File '" + message.message + " " + message.description + "' renamed at: " + message.date);
                    } else {
                        console.error("Unrecognized message type: " + message);
                    }
                });
    };

clientWatch('192.168.1.107', 6787);