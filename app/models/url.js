// app/models/url.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Url', urlSchema);