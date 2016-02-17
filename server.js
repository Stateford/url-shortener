// server.js

// MODULES
// =====================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

// confiure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; 
 
// connect to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var Schema = mongoose.Schema;

var Count = mongoose.model('identitycounters', new Schema({ model: String, field: String, count: Number, _v: Number }));
         
var count = new Count();


// import scripts
var Url = require('./app/models/url');
var urlCheck = require('./app/script/urlcheck');


// ROUTES FOR OUR API
// ===============================
var router = express.Router();

//middleware to use for all requests
router.use(function(req, res, next) {
    //do logging
    console.log('Something is happening.');
    next();
});

// server INDEX.html to client
router.get('/', function(req, res) {
    //event log
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 

//more routes for our API will happen here

// on routes that end in /new
// -------------------------
router.route('/new')
    //create a url (accessed at POST http://localhost:8080/url)
    .post(function(req, res) {
        var input = req.body.original_url;
        //find if url already exists
        if(urlCheck(input)) {
            Url.find({ original_url: input}, function(err, link) {
                if(link.length) {
                    res.json(link)
                }else {
                    var url = new Url();  // create a new instance of the url model
                    url.original_url = input; //set the url name (comes from the request)

                    Count.find(function(err, num) {
                        if(err)
                            res.send(err);
                        var currentCount = num[0].count;
                        currentCount++;
                        url.short_url = "http://localhost:8080/" + currentCount;
                    });



                //save the url and check for errors
                    url.save(function(err) {
                        if(err)
                        res.send(err);

                    res.send('url created!');
                    });
                }
            })
        }
        //if url doesnt exist
        else {
            res.send('that is not valid url');
        }
    })

// on routes that end in /new/:original_url
// ----------------------------------------
router.route('/new/*?')
    .get(function(req, res) {
         Url.find({ original_url: req.params[0]}, function(err, url) {
            if(err)
                res.send('error: ' +err);
            res.json(url);
    });
});


// on routes that end in /all
// ---------------------------
router.route('/all')
    .get(function(req, res) {
        Url.find(function(err, urls) {
            if(err)
                res.send(err);
            res.json(urls);
        })
    });

// on routes that end in /latest
// -----------------------------
router.route('/latest')
    .get(function(req, res) {
        // GET the last 10 created
        Url.find().sort({ _id: - 1 }).limit(10).exec(function(err, links) {
            if(err)
                res.send(err);
            res.json(links);
        })
})


//on routes that end in /:short_url
// -------------------------------------
router.route('/:short_url(*)')

    //get the url with that id(accessed at GET http://localhost:8080/:short_url)
    .get(function(req, res) {
        var input = req.params.short_url;
        if(urlCheck(input)) {
            Url.find({ orginal_url: input }, function(err, link) {
                if(link.length) {
                    res.json(link)
                }else {
                    var url = new Url();  // create a new instance of the url model
                    url.original_url = input; //set the url name (comes from the request)

                    Count.find(function(err, num) {
                        if(err)
                            res.send(err);
                        var currentCount = num[0].count;
                        currentCount++;
                        url.short_url = "http://localhost:8080/" + currentCount;
                    });
                }
            })
        }
});
        



//REGISTER OUR ROUTES -------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// ============================
app.listen(port);
console.log('Magic happens on port ' + port);