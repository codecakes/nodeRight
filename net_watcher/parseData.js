"use strict";

const
    util = require("util"),
    eventEmitter = require("events").EventEmitter,
    parseData = function parseData (stream) {
    /**
     * stream is client connection stream which is stream type.
     */
    const 
        MsgEmitter = function MsgEmitter (stream) {
            eventEmitter.call(this);
            let 
                self = this,
                buffer = '';
            
            self.on('error', function (data) {
                console.error("Event Stream error\n");
                console.error(data);
            });
            
            console.log("emitting from parseData..\n");
            
            stream.on('data', function streamClientData(data) {
                buffer += data;
                if ( buffer.indexOf("\n") !== -1 ) {
                    self.emit('message', JSON.parse(buffer));
                    buffer = '';
                }
            });
            
            stream.on('error', function (err) {
                //console.error("Client Connection Socket Stream error\n");
                console.error(err);
                self.emit('message', "Client Connection Socket Stream error\nConnection abruptly terminated");
                stream.end();
                //stream.unref();
                //stream.destroy();
                //process.exit();
            });
            
            stream.on('close', function (err) {
                if (err) console.error(err);
                self.emit('message', "Client Connection Socket Stream closed\n");
                //stream.end();
                //stream.unref();
                stream.destroy();
                //process.exit();
            });
            
            stream.on('end', function (err) {
                if (err) console.error(err);
                self.emit('message', "Client Connection Socket Ended\n");
                stream.destroy();
            });
        };
    
    util.inherits(MsgEmitter, eventEmitter);
    return new MsgEmitter(stream);
};

exports.parseData = parseData;