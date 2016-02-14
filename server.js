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
    console.log('served index.html');
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
    
        var url = new Url();  // create a new instance of the Bear model
        url.original_url = req.body.original_url; //set the url name (comes from the request)
    
        url.short_url = req.body.short_url;
    
        //save the bear and check for errors
        url.save(function(err) {
            if(err)
                res.send(err);
            
            res.json({ message: 'url created!' });
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

//on routes that end in /:short_url
// -------------------------------------
router.route('/:short_url')

    //get the url with that id(accessed at GET http://localhost:8080/:short_url)
    .get(function(req, res) {
        Url.findById(req.params.short_url, function(err, url) {
            if(err)
                res.send(err);

            res.json(url);
        });
    });
    
//onroutes that end in :/original_url
//-----------------------------------


//REGISTER OUR ROUTES -------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// ============================
app.listen(port);
console.log('Magic happens on port ' + port);