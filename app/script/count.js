// app/script/count.js

// modules
// ==============================
var mongoose = require('mongoose');

Url.findOne({}, {}, {sort: {x: -1}}, function(err, post) {
    console.log(post);
})
//db.foo.find().sort({x:-1});
//https://stackoverflow.com/questions/12467102/how-to-get-the-latest-and-oldest-record-in-mongoose-js-or-just-the-timespan-bet