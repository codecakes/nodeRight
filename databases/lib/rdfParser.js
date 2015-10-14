#!/usr/local/bin/node --harmony

"use strict";

const
    fs = require("graceful-fs"),
    cheerio = require("cheerio"),
    rdfParse = function rdfParse (rdfFile, cb) {
        console.log('file path: '+ rdfFile);
        //load file
        fs.readFile(rdfFile, function (err, data) {
            if (err) { throw Error(err);}

            //load the rdf file content
            let
                $rdf = cheerio.load(data.toString(), {
                    normalizeWhitespace: true,
                    xmlMode: true
                }),
                //extract file scheme to JSON
                extract = {},
                _id;

            $rdf('dsbase\\:m4ku-rg94').map(function eachTag (index, elem) {
                _id =  $rdf(elem).children('socrata\\:rowID').text();

                extract[_id] = {
                    _id: _id,
                    date: $rdf(elem).children('ds\\:date').text(),
                    headline: $rdf(elem).children('ds\\:name').text(),
                    link: $rdf(elem).attr('rdf:about')
                };
            });

            //console.log(extract);
            //asynchronous function arg passed
            cb(null, extract);
        });
    };

/**
 * For running local file as __main file. testing/debug purposes.
 *
 * rdfParse( path.join(dumpDir, 'rows.rdf'), function cb (err, extract) {
    if (err) {throw Error(err);}
    console.log(extract);
});
*/

exports.rdfParse = rdfParse;