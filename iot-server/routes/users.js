var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
var User = require("../models/users");
var bcrypt = require("bcrypt-nodejs");

// Secret key for JWT
var secret = fs.readFileSync(__dirname + '/../jwtkey').toString();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Register a new user */
router.post('/signup', function(req, res, next) {
  // Create a hash for the submitted password
  bcrypt.hash(req.body.password, null, null, function(err, hash) {
  	// Prepare a new user
  	var newUser = new User( {
  	    email: req.body.email,
  	    fullName: req.body.fullName,
  	    passwordHash: hash // hashed password
  	});
  	newUser.save( function(err, user) {
      if (err) { // this error could be a duplicate key error when the same email insertion tried
        // console.log(err.errmsg); // show the db's error message.
        // For the safety reason, do not specify the detailed error message.
        res.status(400).json( {success: false, message: "Bad Request" } );
      } else {
        res.status(201).json( {success: true, message: user.fullName + " has been created", redirect:"/signin.html" } );
      }
  	});
  });
});

module.exports = router;
