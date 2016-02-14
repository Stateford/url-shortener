// app/models/url.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    short_url: String,
    orignal_url: String
});

module.exports = mongoose.model('Url', urlSchema);