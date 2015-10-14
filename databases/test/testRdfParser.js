#!/usr/local/bin/node --harmony

"use strict";

const
    path = require("path"),
    rdfParse = require(path.join('../', 'lib', 'rdfParser.js')).rdfParse,
    rdfDump = path.join( 'rdfDump', 'rows.rdf'),
    testParser = {

        testParser: function testParser (test){
            test.expect(3);
            rdfParse(rdfDump, function testCB(err, extract) {
                //test if no error
                test.ifError(err);

                //test if its a dictionary
                test.strictEqual(typeof extract, 'object', 'Should be a dictionary Object');

                //test for 39 counts of inner meta objects
                let keys = Object.keys(extract);
                test.strictEqual(keys.length, 39, "Total rdf Meta Count is 39 Entries");

                //console.log(extract);
                test.done();
            });
        }
    };

exports.testParser = testParser;