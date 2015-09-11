#!/usr/local/bin/node --harmony

"use strict";

const sockWatcher = function sockWatcher (fsock) {
    const
        fs = require("fs"),
        net = require("net"),
        writeStream = require("stream").Writable,
        util = require("util"),
        path = require("path"),
        log = path.join(__dirname, 'netLogFile.txt'),
        watchFile = path.join(__dirname, 'theFile.txt'),
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
            
           //connection.write("Connected to " + connection.remoteAddress + "\n");
           //streamLog.write("Connected to " + connection.remoteAddress + "\n");
           
           fs.watch(watchFile, function watcher (evt, fname) {
               if (evt === 'change') {
                   connection.write('file changed\n', function connectionWrite () {
                       streamLog.write('file changed\n');
                   });
               }
               
               if (evt === 'rename') {
                   connection.write('file renamed\n', function connectionWrite () {
                       streamLog.write('file renamed\n');
                   });
               }
           });
           
           connection.on('end', function connectionEnd () {
               console.log("Client Connection Ended");
           });
           
           connection.on('close', function connectionClose() {
              console.log("Connection Closed");
           });
           
           connection.on('error', function connectionErr (err) {
               console.error(err);
               server.close();
           });
           
           connection.write("server started. listening on remote socket\n");
           connection.write("connection writing\n");
           streamLog.write('connection writing\n');
        });
    
    streamLog.on('error', function logErr (err) {
        console.error(err);
        streamLog.end();
    });
    
    fs.open(watchFile, 'a+');
    
    server.listen(fsock, function serverStart () {
        console.log("server started. listening on local socket:"+ fsock);
    });
};

sockWatcher('watch.sock');