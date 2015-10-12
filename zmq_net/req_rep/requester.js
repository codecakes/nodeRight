#!/usr/local/bin/node --harmony

'use strict';

const
    fnReq = require("./req.js").fnReq,
    request = Object.create(fnReq);

request.init('0.0.0.0', 5433);
request.start();