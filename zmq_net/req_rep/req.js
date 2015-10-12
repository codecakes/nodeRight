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
    requester = zmq.socket('req'),
    fnReq = {
        init: function init(host, port) {
            console.log("connecting..");
            requester.connect('tcp://'+host+':'+port);
        },
        start: function fnReq () {
            const
                txData = {
                            reqPid: process.pid,
                            reqPlatform: process.platform
                };

            //Upon Recving response
            requester.on('message', function requesterMsg (data) {
                let
                    rep_data = JSON.parse(data);

                console.log("received data with Response Process ID: " + rep_data.pid);
                console.log(rep_data);

            });

            //Send 3 requests with a chunk JSON each
            for (let counter = 0, chunk; counter < 1; counter++) {
                chunk = JSON.stringify({
                            txData: txData,
                            time: +new Date
                        });

                console.log("sending chunk of message.." + (counter+1));
                requester.send(chunk);
            }
        }
    };

exports.fnReq = fnReq;

let request = Object.create(fnReq);

request.init('0.0.0.0', 5433);
request.start();