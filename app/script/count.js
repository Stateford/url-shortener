// app/script/count.js

// MODULES
// =========================
var mongoose = require('mongoose');
var Url = require('../models/url');

var count = '';

var currentCount = Url.find().sort({ _id: -1 }).limit(1).exec(function(err, urls) {
    count = urls[0].short_url;
})


var update = function() {
    count = Number(count);
    count = count + 1
    count.toString();
    console.log(count);
    return count;
}

module.exports = update;