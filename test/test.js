const
    expect = require('chai').expect,
    assert = require("assert");


describe("JSON", function() {
   describe(".parse()", function() {
       it("should detect malformed JSON strings", function(){
           assert.throws(function () {JSON.parse({"g":1,"d":"2","k":3})}, SyntaxError);
       });
   });
});

describe("Add", function() {
   describe("sum() function", function() {
       it("should yield correct addition", function(){
           expect(1+1).to.equal(2);
       });
   });
});
