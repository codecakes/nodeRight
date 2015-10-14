#!/usr/local/bin/node --harmony

"use strict";

const
    walk = require("fs-walk"),
    path = require("path"),
    //rdfDump = path.join('../', 'rdfDump'),
    rdfParse = require(path.resolve(__dirname, 'rdfParser.js')).rdfParse,
    parseAllDir = function parseAllDir (dir, cb) {
        //CallBack would usually store each dump dictionary into the NoSQL DB
        let resolvedPath;
        //walk each dir and subdir recursively
        walk.files(dir, function(basedir, filename, stat, next) {

            resolvedPath = path.resolve(basedir, filename);
            //console.log('working on: ' + path.resolve(basedir, filename));

            if ( path.parse(resolvedPath).ext === '.rdf' ) {
                rdfParse(resolvedPath, function cbParse (err, dump) {
                    if (err) { throw Error(err); }
                    //console.log(dump);
                    cb(null, dump);
                });
            }
            next();
        },
        function Err (err) {
            if (err) {console.error(err);}
        });
    };

//parseAllDir(rdfDump);
exports.parseAllDir = parseAllDir;

