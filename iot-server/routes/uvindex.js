var express = require('express');
var router = express.Router();
var request = require("request");

router.get('/', function(req, res, next) {
  var responseJson = {
    uv : "Invalid",
    status: "ERROR"
  };

  // Fill your weather.io api key.
  var apikey = "YOUR_API_KEY";

  if (req.query.hasOwnProperty("zip")) {
  	var zip_code = req.query.zip;
    if (isNaN(parseInt(zip_code))) {
      // Failure (200): Invalid ZIP code
      return res.status(200).send(JSON.stringify(responseJson));
    }
  } else {
    // Failure (400): Bad request (invalid query string)
    responseJson = {error: "zip parameter missing"};
    return res.status(400).send(JSON.stringify(responseJson));
  }

  // Make a request from your server to the third-party server
  request({
    method: "GET",
    uri: "https://api.weatherbit.io/v2.0/current",
    qs: {
      postal_code: zip_code,
      key : apikey
    }
  }, function(error, response, body) {
    // If the zip_code is invalid, body will be empty. Need to check it at first.
    if (body) {
      var data = JSON.parse(body);

      responseJson.uv = data.data[0].uv;
      responseJson.status = "OK";
      // Send the response
      res.status(200).send(JSON.stringify(responseJson));
    } else
      return res.status(200).send(JSON.stringify(responseJson));

  });
});

module.exports = router;
