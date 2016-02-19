// server.js

// MODULES
// =====================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');


// confiure app to use bodyParser()
// this will let us get the data from a POST
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var host = require('./config/host');
 
// connect to database
var mongoose = require('mongoose');
var configDB = require('./config/database');
mongoose.connect(configDB.url);

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
        // check to see if it's a valid URL
        if(urlCheck(input)) {
            // search db for url
            Url.find({ original_url: input}, function(err, link) {
                // check if URL exists
                if(link.length) {
                    res.json(link)
                }else {
                    var url = new Url();  // create a new instance of the url model
                    url.original_url = input; //set the url name (comes from the request)

                    Count.find(function(err, num) {
                        if(err)
                            res.send(err);
                        var currentCount = num[0].count;
                        currentCount = Number(currentCount);
                        currentCount++;
                        currentCount = currentCount.toString();
                        url.short_url = host.url + currentCount;
                    })



                //save the url and check for errors
                    url.save(function(err) {
                        if(err)
                        res.send(err);

                    res.send('url created!');
                    })
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
        // the GET request
    .get(function(req,res) {
        var input = req.params[0];
        // check if it's a valid URL
        if(urlCheck(input)) {
            Url.find({ original_url: req.params[0]}, function(err, link) {
                if(link.length) {
                    res.json(link);
                } else {
                    var url = new Url();
                    
                    url.original_url = input;
                    
                    Count.find(function(err, num) {
                        if(err)
                            res.send(err);
                        var currentCount = num[0].count;
                        currentCount = Number(currentCount);
                        currentCount++;
                        currentCount = currentCount.toString();
                        url.short_url = host.url + currentCount;
                    })
                    
                    // save the url and check for errors
                    url.save(function(err) {
                        if(err)
                            res.send(err);
                        
                        res.send('url created!');
                    })
                    
                }
            })
        }
    else {
        res.send('that is not a valid url');
    }

})
    
router.get('/all', function(req, res) {
    //event log
    res.sendFile(path.join(__dirname + '/public/all.html'));
});


// on routes that end in /api/all
// ---------------------------
router.route('/api/all')
    .get(function(req, res) {
        Url.find(function(err, urls) {
            if(err)
                res.send(err);
            res.json(urls);
        })
    });

// on routes that end in /latest
// -----------------------------
router.route('/api/latest')
    .get(function(req, res) {
        // GET the last 10 created
        Url.find().sort({ _id: - 1 }).limit(10).exec(function(err, links) {
            if(err)
                res.send(err);
            res.json(links);
        })
});


//on routes that end in /:short_url
// -------------------------------------
router.route('/:short_url')

    //get the url with that id(accessed at GET http://localhost:8080/:short_url)
    .get(function(req, res) {
        var input = req.params.short_url;
        Url.find({ count: input }, function(err, link) {
            if(link.length) {
                if(err) 
                    res.send(err);
                else {
                    res.redirect(link[0].original_url);
                }
            } else {
                res.send('not a shortened url');
            }
        })
});


//REGISTER OUR ROUTES -------------
// all of our routes will be prefixed with /api
app.use('/', router);

// START THE SERVER
// ============================
app.listen(host.port);
console.log('Magic happens on port ' + host.port);