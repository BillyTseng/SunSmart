var express = require('express');
var router = express.Router();
var Record = require("../models/record");

/* POST: device post a new record to database. */
router.post('/post', function(req, res, next) {
  // response message object
  var response = {
      status: "",
      message: ""
  };
  // DEBUG message: enumerate request’s body and print out key and value
  for( var key in req.body) {
      console.log( key + ":" + req.body[key] );
  }

  var newRecord = new Record({
    deviceId: req.body.deviceId,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    uv: req.body.uv
  });

  newRecord.save(function(err, newRecord) {
    if (err) {
      response.status = "Error";
      response.message = err;
      res.status(400).send(JSON.stringify(response));
    } else {
      response.status = "OK";
      response.message = "Data saved in db with object ID " + newRecord._id + ".";
      res.status(201).send(JSON.stringify(response));
    }
  });
});

module.exports = router;
