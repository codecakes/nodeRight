#!/usr/local/bin/node --harmony

/**
 * Description:
 * Search for files that match a given query. 
 * For the sake of learning Node.js TDD
 */

var expect = require('chai').expect;

describe("JSON", function() {
   describe(".parse()", function() {
       it("should detect malformed JSON strings", function(){
           assert.throws(function () {JSON.parse({"g":1,"d":"2","k":3})}, SyntaxError);
       });
   });
});