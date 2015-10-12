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
        init: function init() {
            console.log("connecting..");
            requester.connect('tcp://0.0.0.0:5433');
        },
        start: function fnReq () {
            const
                txData = {
                            reqPid: process.pid,
                            reqPlatform: process.platform
                },
                chunk = JSON.stringify({
                            txData: txData,
                            time: +new Date
                        });

            //Recvd response/reply
            requester.on('message', function requesterMsg (data) {
                let
                    rep_data = JSON.parse(data);

                console.log("received data with Response Process ID: " + rep_data.pid);
                console.log(rep_data);

            });

            console.log("sending chunk of message..");
            requester.send(chunk);
        }
    },
    request = Object.create(fnReq);

request.init();
request.start();


