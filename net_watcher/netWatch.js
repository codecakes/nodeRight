#!/usr/local/bin/node --harmony

"use strict";

const netWatcher = function netWatcher (port, host) {
    const
        fs = require("fs"),
        net = require("net"),
        writeStream = require("stream").Writable,
        util = require("util"),
        path = require("path"),
        log = path.join(__dirname, 'netLogFile.txt'),
        watchFile = path.join(__dirname, 'theFile.txt'),
        fswatcher = fs.watch,
        logStream = function logStream () {
            this.log = log;
            writeStream.call(this);
        };
    
    util.inherits(logStream, writeStream);
    
    logStream.prototype._write = function logStreamWrite (data, enc, cb) {
        fs.appendFile(this.log, data, 'utf8', function appendFileErr (err) {
            if (err) throw Error(err);
            cb();
        });
    };
    
    const 
        streamLog = new logStream(),
        server = net.createServer( function serverConnection (connection) {
            
            connection.write(JSON.stringify({
                   type: "connected", 
                   message:"connection writing",
                   description: "Connected to: " + connection.remoteAddress + 
                   "\n server listening on remote port: "+ connection.localPort
            + " with remote address: " + connection.localAddress
               }));
            
            connection.write("\n");
           
           streamLog.write("Connected to " + connection.remoteAddress + "\n");
           
           fswatcher(watchFile, function watcher (evt, fname) {
               if (evt === 'change') {
                   
                   connection.write(
                       JSON.stringify({
                           type: "change",
                           message:'file changed',
                           description: 'Changed File: ' + fname.toString(),
                           date: new Date()
                       }), 
                       function connectionWrite () {
                       streamLog.write('file changed\n');
                   });
                   connection.write("\n");
               }
               
               if (evt === 'rename') {
                   connection.write(
                       JSON.stringify({
                           type: "rename",
                           message:'file renamed',
                           description: 'Renamed File: ' + fname.toString(),
                           date: new Date()
                       }), 
                       function connectionWrite () {
                       streamLog.write('file renamed\n');
                   });
                   connection.write("\n");
               }
           });
           
           connection.on('end', function connectionEnd () {
               console.log("Client Connection Ended");
               connection.unref();
               connection.destroy();
           });
           
           connection.on('close', function connectionClose() {
              console.log("Connection Closed");
              //connection.unref();
              //connection.destroy();
           });
           
           connection.on('error', function connectionErr (err) {
               console.error(err);
           });
           
        });
    
    streamLog.on('error', function logErr (err) {
        console.error(err);
        streamLog.end();
    });
    
    //streamLog.write('connection writing\n');
    fs.open(watchFile, 'a+');
    
    server.listen(port, host, function serverStart () {
        console.log("server started. listening on local port:"+ port
        + "with local address:" + host);
    });
};

netWatcher(6787, '192.168.1.107');