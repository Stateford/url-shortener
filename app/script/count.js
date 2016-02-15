// app/script/count.js

// modules
// ==============================
var mongoose = require('mongoose');

module.exports = function() {
    Url.findOne({}, {}, {sort: {short_url: -1}}, function(err, post) {
        var count = Number(post);
        count++;
        return count;
    });
};