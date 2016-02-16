// app/script/latest.js

// modules
// ==============================
var mongoose = require('mongoose');
var Url = require('../models/url');

module.exports = function() {
    Url
        .find()
        .sort({ _id: -1 })
        .limit(10)
        .exec(function(err, links) {
        if(err)
            throw err;
            
        return links;
    });
};