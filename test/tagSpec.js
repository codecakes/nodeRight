const
    tags = require("../tdd_app/lib/tag.js"),
    expect = require("chai").expect;

//testing synchronous IO returns
describe("Tags", function(){
    
    describe("#isNumber()", function(){
        
        it("should tell if the input is true Number or not", function() {
            isNumber = tags.isNumber;
            expect(isNumber('-5')).to.deep.equal(true);
            expect(isNumber('-$#')).to.deep.equal(false);
            expect(isNumber('5000')).to.deep.equal(true);
        });
    });
   
   describe("#parse()", function(){
       
       it("should parse long formed tags", function(){
           var args = ["--depth=4", "--hello=world", '-h', '5'];
           var results = tags.parse(args);
           //console.log(results);
           var expected = 4;
           expect(results).to.have.a.property("depth", expected);
           expected = "world";
           expect(results).to.have.a.property("hello", expected);
           expected=5;
           expect(results).to.have.a.property("h", expected);
       });
       
       it("should fallback to defaults", function(){
           var args = ["--depth=4", "--hello=world"];
           var defaults = { depth: 2, foo: "bar" };
           var results = tags.parse(args, defaults);
         
           var expected = {
                depth: 4,
                foo: "bar",
                hello: "world"
           };
         
           expect(results).to.deep.equal(expected);
        });
        
        it("should accept tags without values as a bool", function(){
            var args = ["--searchContents", "--search"];
            var results = tags.parse(args);
            
            expect(results).to.have.a.property("searchContents", true);
            expect(results).to.have.a.property("search", true);
        });
        
        it("should accept short formed tags", function(){
            var args = ["-s", "-d=4", "-h"];
            var replacements = {
                s: "searchContents",
                d: "depth",
                h: "hello"
            };
         
            var results = tags.parse(args, {}, replacements);
         
            var expected = {
                searchContents: true,
                depth: 4,
                hello: true
            };
         
            expect(results).to.deep.equal(expected);
        });
        
        it("should accept short formed tags without values as bools if its first arg param", function(){
            var args = ["-svg", "-d=4", "-h"];
            var replacements = {
                s: "searchContents",
                d: "depth",
                h: "hello"
            };
         
            var results = tags.parse(args, {}, replacements);
         
            var expected = {
                searchContents: true,
                depth: 4,
                hello: true
            };
         
            expect(results).to.deep.equal(expected);
            
            var results = tags.parse(["-svg", "-h", "-d=456", "--help"], {}, replacements);
         
            var expected = {
                searchContents: true,
                depth: 456,
                hello: true,
                help: true
            };
            expect(results).to.deep.equal(expected);
        });
   });
});