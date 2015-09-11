#!/usr/local/bin/node --harmony

"use strict";

const
    zmq = require("zmq"),
    sub = zmq.socket('sub'),
    subWatch = function subWatch (host, port) {
        
        // handle messages from publisher
        sub.on('message', function subMessage (data) {
            let msg = JSON.parse(data);
            console.log(data.toString());
        });
        
        //subscribe to all messages
        sub.subscribe("");
        
        sub.connect("tcp://"+host+":"+port);
    };

subWatch('192.168.1.107', 6787)  