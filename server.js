// server.js

// BASE SETUP
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

// import scripts
var Url = require('./app/models/url');

// ROUTES FOR OUR API
// ===============================
var router = express.Router();

//middleware to use for all requests
router.use(function(req, res, next) {
    //do logging
    console.log('Something is happening.');
    next();
});

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
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
        
        Url.find({ original_url: input}, function(err, link) {
            if(link.length) {
                res.send(link)
            }else {
                var url = new Url();  // create a new instance of the url model
                url.original_url = input; //set the url name (comes from the request)
            
            //save the url and check for errors
                url.save(function(err) {
                    if(err)
                    res.send(err);
            
            res.send('url created!');
        });
            }
        })
    
        
    })
    .get(function(req, res) {
        Url.find({ original_url: req.query}, function(err, url) {
            if(err)
                res.send('error: ' + err);
            res.send(url);
        })
    });

// on routes that end in /new/:original_url
// ----------------------------------------
router.route('/new/:original')
    .get(function(req, res) {
         Url.find({ original_url: req.params.original}, function(err, url) {
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
router.route('/:short_url')

    //get the url with that id(accessed at GET http://localhost:8080/:short_url)
    .get(function(req, res) {
        Url.find( {short_url: req.params.short_url }, function(err, url) {
            if(err)
                res.send(err);
            res.json(url);
        });
    });


//REGISTER OUR ROUTES -------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// ============================
app.listen(port);
console.log('Magic happens on port ' + port);