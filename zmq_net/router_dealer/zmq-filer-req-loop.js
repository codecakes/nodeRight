#!/usr/local/bin/node --harmony

"use strict";

const
    zmq = require("zmq"),
    filename = 'requestFile.txt',
    requester = zmq.socket("req"),
    reqFunction = function reqFunction () {
        requester.on('message', function reqMsg (data) {
            let
                response = JSON.parse(data);
            console.log("Received response:", response);
           
        });
        requester.connect("tcp://localhost:5433");
        
        // send request for content
        for (let i=1; i<=5; i++) {
            console.log('Sending request ' + i + ' for ' + filename);
            requester.send(JSON.stringify({
            path: filename
            }));
        }
};

reqFunction();