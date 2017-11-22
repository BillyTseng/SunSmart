var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
var User = require("../models/users");
var bcrypt = require("bcrypt-nodejs");

// Secret key for JWT
var secret = fs.readFileSync(__dirname + '/../jwtkey').toString();

/* GET Authenticate user on sign in. */
router.post('/signin', function(req, res, next) {
  User.findOne( { email: req.body.email} , function(err, user) {
    if (err) {
      res.status(401).json({ error: "Database findOne error" });
    } else if (!user) {
      res.status(401).json({ error: "Bad Request" }); // User not exist
    } else {
      bcrypt.compare(req.body.password, user.passwordHash, function(err, valid) {
        if (err) {
            res.status(401).json({ error: "bcrypt error" });
        } if (valid) {
            var token = jwt.encode({email: req.body.email}, secret);
            res.status(201).json({ token: token , fullName: user.fullName, redirect: "/home.html"});
        } else {
            res.status(401).json({ error: "Bad Request" });  // Wrong password
        }
      });
    }
  });
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
