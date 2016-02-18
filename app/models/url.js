// app/models/url.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

// connect to database
var configDB = require('../../config/database');
var connection = mongoose.createConnection(configDB.url);

autoIncrement.initialize(connection);

var urlSchema = new Schema({
    original_url: String,
    short_url: String
});

urlSchema.plugin(autoIncrement.plugin, { model: 'Url', field: "count"});

module.exports = mongoose.model('Url', urlSchema);