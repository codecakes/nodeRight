#!/usr/local/bin/node --harmony

"use strict";

const
    zmq = require("zmq"),
    cluster = require("cluster"),
    host = '0.0.0.0',
    portRouter = 5433,
    portDealer = 5436,
    rep = require("./rep.js").fnRespond,
    clusterCore = function clusterCore (host, portRouter, portDealer) {

        //Detect Cluster Termination event on Graceful kills or abrupt halt
        cluster.on('disconnect', function(worker) {
          console.log('The PARENT worker #' + worker.id + ' with process id: '+ process.pid + ' has disconnected');
        });

        if ( cluster.isMaster ) {

            // master process - create ROUTER and DEALER sockets, bind endpoints
            let
                router = zmq.socket("router"),
                dealer = zmq.socket("dealer");

            router.bindSync('tcp://'+host+':'+portRouter);
            dealer.bindSync('tcp://'+host+':'+portDealer);

            router.on("message", function () {
                let frames = Array.apply(null, arguments);
                dealer.send(frames);
            });

            dealer.on("message", function () {
                let frames = Array.apply(null, arguments);
                router.send(frames);
            });

            console.log("starting cluster PARENT process id: " + process.pid);

            // listen for workers to come online
            cluster.on('online', function(worker) {
               console.log(worker.process.pid.toString() + ' worker is online');
            });

            //Start Evented Child Node Processes alongwith a Request REQ Each
            router.on("accept", function funcCB (fileDesc, endPt) {
                //fire up a cluster fork for handling Requests
                console.log("starting a new FORK process");
                cluster.fork();

                //OPTIONAL: fire up a request
                //request = Object.create(req);
                //request.init(host, portRouter);
                //request.start();
            });

            //start the socket ROUTER monitor
            router.monitor(200, 0);

            router.on('disconnect', function routerDisconnect (fd, ep) {
                console.log("router Disconnected with process id: " + process.pid);
                console.log('Stopping the monitoring');
                router.unmonitor();
            });

            /**
             * Alternative hardcoded approach
            for (let counter = 0, request; counter < 3; counter++) {

                //fire up a cluster fork for handling Requests
                //cluster.fork();

                //OPTIONAL: fire up a request
                //request = Object.create(req);
                //request.init(host, portRouter);
                //request.start();
            }
            */
        } else {
            /** for each Forked process, a Responder REP will connect to DEALER
             * to handle the REQ
             */

            console.log("starting cluster CHILD process id: " + process.pid);

            let
                respond = Object.create(rep);
            respond.init(host, portDealer);
            respond.start();

            cluster.on('exit', function(worker, code, signal) {
              console.log('worker %d died (%s). restarting...',
                worker.process.pid, signal || code);
              cluster.fork();
            });
        }
    };


clusterCore(host, portRouter, portDealer);