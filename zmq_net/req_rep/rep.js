#!/usr/local/bin/node --harmony

/**
 * In a REQ/REP pair, communication occurs in a lockstep. A request comes in,
    then a reply goes out.

    Additional incoming requests are queued and later
    dispatched by ØMQ. Your application, however, is only aware of one request
    at a time.
*/

'use strict';

const
    fs = require("fs"),
    zmq = require("zmq"),
    responder = zmq.socket('rep'),
    /* Responder function that echoes back incoming request*/
    fnRespond = {
        'init': function init (host, port) {
                console.log("initializing connection..");
                /**
                 * The responder binds to TCP port 5433 of the loopback interface (IP 127.0.0.1)
                to wait for connections. This makes the responder the stable endpoint of the
                REP/REQ pair.
                */
                //Instead of binding, here REP is connecting to DEALER socket which is in cluster.js
                responder.connect('tcp://'+host+':'+port);
                console.log("listening..to host: " + host + " on port: "+port);
        },
        'start': function start () {
            console.log("starting responder..");
            responder.on('message', function respondMsg (data) {
                    //On incoming message
                    //parse JSON data
                    let req = JSON.parse(data);
                    console.log("received data with process id " + req.txData.reqPid + " from platform " + req.txData.reqPlatform);
                    console.log(req);

                    //echo same data with some meta
                    console.log("echoing data back.. " + req);
                    responder.send(JSON.stringify({
                        req:req,
                        time: +new Date,
                        pid: process.pid
                    }));
                });

            // close the responder when the Node process ends
            process.on('SIGINT', function() {
                console.log('Shutting down...');
                responder.close();
            });
        }
    };

exports.fnRespond =fnRespond;