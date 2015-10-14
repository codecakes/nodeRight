#!/usr/local/bin/node --harmony

"use strict";

const
    path = require("path"),
    request = require('request'),
    rdfDumpDir = path.resolve('./rdfDump'),
    parseAllDir = require(path.resolve(__dirname, 'lib', 'parseAll.js')).parseAllDir,
    storeDB = function storeDB (dir) {
        let options;
        parseAllDir(dir, function cbDumpDB (err, dump) {
            if (err) { throw Error(err); }
            options = {
                method: 'PUT',
                url: 'http://localhost:5984/' + 'oregano_pesticides',
                json: JSON.stringify(dump)
            };
            //console.log("options is");
            //console.log(options);
            request(options, function(err, res, body) {
                if (err) { throw Error(err); }
                console.log(res.statusCode);
                console.log(body);
            });
        });
    };

storeDB(rdfDumpDir);