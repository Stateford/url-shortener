// app/models/url.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost:27017');

autoIncrement.initialize(connection);

var urlSchema = new Schema({
    original_url: String,
    short_url: String
});

urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: "count"});

module.exports = mongoose.model('Url', urlSchema);