// server.js

// BASE SETUP
// =====================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// confiure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

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
    res.json({ message: 'horray! welcome to our api!'});
});

//more routes for our API will happen here

//on routes that end in /bears
// ============================
router.route('/:url')
    //create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
    
        var url = new Url();  // create a new instance of the Bear model
        url.long = req.body.name; //set the bears name (comes from the request)
    
        //save the bear and check for errors
        url.save(function(err) {
            if(err)
                res.send(err);
            
            res.json({ message: 'url created!' });
        });
    })
    .get(function(req, res) {
        Url.find(function(err, bears) {
            if(err)
                res.send(err);
            
            res.json(url);
        })
    });

//on routes that end in /bears/:bear_id
// -------------------------------------
router.route('/:url_short')

    //get the bear with that id(accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if(err)
                res.send(err);

            res.json(bear);
        });
    })
    
    //update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {
        
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function(err, bear) {
            
            if(err)
                res.send(err);
            
            bear.name = req.body.name;    //update the bears info
            
            //save the bear
            bear.save(function(err) {
                if(err)
                    res.send(err);
                
                res.json({ message: 'Bear updated!' });
            });
        });
    });


//REGISTER OUR ROUTES -------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================
app.listen(port);
console.log('Magic happens on port ' + port);