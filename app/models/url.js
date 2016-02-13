// app/models/url.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    short: String,
    long: String
});

module.exports = mongoose.model('Url', urlSchema);