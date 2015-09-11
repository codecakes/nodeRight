#!/usr/local/bin/node --harmony

"use strict";

const
    fs = require("fs"),
    zmq = require("zmq"),
    util = require("util"),
    pub = zmq.socket('pub'),
    pubWatch = function pubWatch (fname, host, port) {
        let msg;
        fs.open(fname, 'a+', function OpenFile (err, fd) {
            
            if (err) throw Error(err);
            
            fs.watch(fname, function fWatch(evt, f) {
                if (evt === 'change') {
                    msg = JSON.stringify({
                           type: "change", 
                           message:"file changed",
                           description: "file changed: " + fname,
                           date: new Date()
                            });
                    //console.log(msg);
               } else if (evt === 'rename') {
                    msg = JSON.stringify({
                           type: "rename", 
                           message:"file renamed",
                           description: "file renamed: " + fname,
                            date: new Date()
                            });
                    //console.log(msg);
               }
               pub.send(msg);
            });
        });
        
        pub.bind('tcp://'+host+":"+port, function pubBind (err) {
            if (err) throw Error(err);
            console.log(
                util.format("Listening and Publishing on local host: %s and local port: %s ...", host, port));
        });
    };

pubWatch('theFile.txt', '192.168.1.107', 6787);