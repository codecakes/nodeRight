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
        'init': function init () {
                console.log("initializing connection..");
                /**
                 * The responder binds to TCP port 5433 of the loopback interface (IP 127.0.0.1)
                to wait for connections. This makes the responder the stable endpoint of the
                REP/REQ pair.
                */
                responder.bind('tcp://0.0.0.0:5433', function Err (err) {
                    if (err) {console.error('ERROR: ' + err);}
                    console.log("listening..");
                });
        },
        'start': function start () {
            console.log("starting responder..");
            responder.on('message', function responder (data) {
                    //On incoming message
                    //parse JSON data
                    let req = JSON.parse(data);

                    //echo same data with some meta
                    console.log("sending data.. " + req);
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
    },
    resp = Object.create(fnRespond);


resp.start();
resp.init();
