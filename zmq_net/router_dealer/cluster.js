#!/usr/local/bin/node --harmony

"use strict";

const
    zmq = require("zmq"),
    fs = require("fs"),
    cluster = require("cluster"),
    host = 'localhost',
    port = 5433,
    clusterCore = function clusterCore () {
        if ( cluster.isMaster ) {
            
            // master process - create ROUTER and DEALER sockets, bind endpoints
            let
                router = zmq.socket("router"),
                dealer = zmq.socket("dealer");
            
            router.bindSync('tcp://*:5433');
            dealer.bindSync('tcp://*:5436');
            
            router.on("message", function () {
                let frames = Array.apply(null, arguments);
                dealer.send(frames);
            });
            
            dealer.on("message", function () {
                let frames = Array.apply(null, arguments);
                router.send(frames);
            });
            
            // listen for workers to come online
            cluster.on('online', function(worker) {
               console.log(worker.process.pid.toString() + ' worker is online');
            });
            
            // fork three worker processes
            for (let i = 0; i < 3; i++) {
                cluster.fork();
            }
        } else {
            
            let responder = zmq.socket('rep');
            responder.connect('tcp://localhost:5436');
            
            responder.on('message', function(data) {
                let req = JSON.parse(data);
                console.log(process.pid + ' received request for: ' + req.path);
                responder.send(
                    JSON.stringify(
                        {
                            date: new Date,
                            pid: process.pid,
                            path: req.path,
                            data: data.toString()
                        }));
            });
        }
    };

clusterCore();