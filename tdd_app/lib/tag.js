#!/usr/local/bin/node --harmony

"use strict";

const
    isNumber = function isNumber (num) {
        return parseInt(num, 10).toFixed() === 'NaN'? false:true ;
    },
    count = function count(str, char) {
        var
            counts = 0,
            index;
        
        index = str.indexOf(char)
        while ( parseInt(index) !== -1 ) {
            counts++;
            str = str.slice(index+1);
            index = str.indexOf(char);
        }
        return counts;
    },
    parse = function parse (args, defaults, replacements) {
        
        defaults = defaults || { depth: 2, foo: "bar" };
        replacements = replacements || {s: "searchContents",
                                        d: "depth",
                                        h: "hello"};
        
        let opt = {}, curKey, curVal,
            key,val;
        
        for (let pos=0,ln = args.length, eachStr; pos<ln; pos++) {
            eachStr = args[pos];
            
            //if the arg passed doesn't have '='
            if ( eachStr.indexOf('=') === -1 ) {
                
                //if at even pos its an arg val
                if ((pos+1)%2 === 0) {
                    //get numeric value if it isNumber
                    curVal = (isNumber(eachStr)===true)? parseInt(eachStr, 10): eachStr;
                    //if the cur Val is yet another dunder param
                    //its actually intended to have a bool value true
                    if (typeof curVal === 'string') {
                        if ( count(curVal, '-') === 2 || (count(curVal, '-') === 1 && !isNumber(args[pos+1])) ) {
                            opt[eachStr.slice(eachStr.search(/[a-zA-Z]+/))] = true;
                            curVal=undefined;
                        }
                    }
                    
                    if (curKey && curVal) {
                        opt[curKey] = curVal;
                        curVal=undefined;
                    } else if (curKey) {
                        opt[curKey] = true;
                    }
                    curKey = undefined;
                } else {
                    if (pos === 0 && !isNumber(args[pos+1])) {
                        for(let each=0, char, letter=eachStr, ln = eachStr.length; each<ln; each++ ) {
                            char = letter[each];
                            if ( replacements.hasOwnProperty(char) ) {
                                opt[replacements[char]] = true;
                            }
                            letter= letter.slice(each);
                        }
                    } else {
                        if (curKey && !curVal) {
                            opt[curKey] = true;
                        }
                        //else its a parameter key
                        curKey = eachStr.slice(eachStr.search(/[a-zA-Z]+/));
                    }
                }
            } else {
                //just assign rhs to lhs
                key = eachStr.split('=');
                val = isNumber(key[1])? parseInt(key[1], 10): key[1];
                key = key[0].slice(key[0].search(/[a-zA-Z]+/));
                opt[key] = val;
            }
        }
        
        if (curKey) {
            opt[curKey] = true;
            curKey = undefined;
        }
        
        let replace;
        //opt -in for replacement key with same opt value
        Object.keys(replacements).forEach(function iterKeys (eachKey, pos, arr) {
            if (opt.hasOwnProperty(eachKey) && !opt.hasOwnProperty(replacements[eachKey])) {
                replace = opt[eachKey];
                delete opt[eachKey];
                opt[replacements[eachKey]] = replace;
            }
        });
        
        //add missing defaults key value
        Object.keys(defaults).forEach(function iterKeys (eachKey, pos, arr) {
            if (!opt.hasOwnProperty(eachKey)) {
                opt[eachKey] = defaults[eachKey];
            }
        });
        
        
        
        
        return opt;
    };

exports.parse = parse;
exports.isNumber = isNumber;

//for debugging purposes
//console.log(parse(["--depth=4", "--hello=world", '-h', '-5', '--gei', '6', '--jee', '-8']));
//console.log(parse(['-h', '-5', '--gei', '6', '--jee', '-8', "--sd", "--sdf"]));
//console.log(parse(["-s", "-d=4", "-h"]));
//console.log(parse(["-svg", "-d=4", "-h"]));
//console.log(parse(["-svg", "-h", "-d=456"]));
