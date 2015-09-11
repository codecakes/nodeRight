#!/usr/local/bin/node --harmony

"use strict";

const fWatch = (function fWatch () {
    
    const 
    fs = require("fs"),
    spawn = require("child_process").spawn,
    fileWatcher = function fileWatcher (fname) {
        
        const ls = spawn('ls', ['-alh']),
        logfile = 'watchlog.txt',
        wStream = require("stream").Writable,
        logStream = function logStream () {
                        this.file = logfile;
                        wStream.call(this);
                    };
        require("util").inherits(logStream, wStream);
        //write the prototype in the logStream function
        logStream.prototype._write = function logStream_write (data, enc, cb) {
            fs.appendFile(this.file, data, 'utf-8', function WatchLogErr(err) {
               if (err) {throw Error(err);}
               cb(err);
            });
        };
        //instantiate from logStream
        const log = new logStream();
        
        log.on('error', function logErr (err) {
            log.end();
            throw Error(err);
        });
        
        ls.on('error', function lsSpawnErr (err) {
            ls.disconnect();
            throw Error(err);
        });
        
        console.log("watching changes");
        
        //pipe the CMD to log stream
        ls.stdout.pipe( log, { end: false } );
        
        //watch for changes
        try {
            fs.watch(fname, function watcher (evt, fname) {
                /*fname not always available on all platforms */
                let orig = fname || '';
                if (evt === 'change') {
                    log.write("File " + orig + " changed\n");
                    console.log("File " + orig + " changed");
                } else if (evt === 'rename') {
                    log.write("File " + orig + " renamed\n");
                    console.log("File " + fname + " renamed");
                }
            });
        } catch (e) {
            console.error("OOPS There was an Error called by: " + e.syscall + " method with error code: " + e.errno);
        }
    };
    return fileWatcher;
})();
    

fWatch('simple.txt');