var express = require('express');
var router = express.Router();
var Record = require("../models/record");

/* POST: create a new record. */
router.post('/', function(req, res, next) {

  var responseJson = {
    status : "",
    message : ""
  };

  var newRecord = new Record({
    deviceId: req.body.deviceId,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    uv: req.body.uv
  });

  newRecord.save(function(err, newRecord) {
    if (err) {
      var errormsg = {"message": err};
      res.status(400).send(JSON.stringify(errormsg));
    } else {
      responseJson.status = "OK";
      responseJson.message = "Data saved in db with object ID " + newRecord._id + ".";
      res.status(201).send(JSON.stringify(responseJson));
    }
  });
});

// GET request return all
router.get('/status/all', function(req, res, next) {
  var query = {};
  // Query the devices collection to returned requested documents
  Record.find(query, function(err, allDevices) {
    if (err) {
      var errormsg = {"message": err};
      res.status(400).send(JSON.stringify(errormsg));
    } else {
      // Create JSON response consisting of an array of devices
      var responseJson = { devices: [] };
      for (var doc of allDevices) {
        // For each found device add a new element to the array
        // with the device id and last contact time
        responseJson.devices.push({
          "deviceId": doc.deviceId,
          "latitude": doc.latitude,
          "longitude": doc.longitude,
          "uv": doc.uv,
          "time": doc.submitTime
        });
      }
      res.status(200).send(JSON.stringify(responseJson));
    }
  });
});

module.exports = router;
