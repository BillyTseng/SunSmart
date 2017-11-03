var express = require('express');
var router = express.Router();
var request = require("request");
var fs = require('fs');

router.get('/', function(req, res, next) {
  var responseJson = {
    uv : "Invalid",
    status: "ERROR"
  };

  // Import api key from a text file.
  var apikey = fs.readFileSync(__dirname + '/../3rd-party-apikeys/weatherbit').toString();
  // Trim newlines away
  apikey = apikey.replace(/(\r\n|\n|\r)/gm,"");

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
      // Add error handling while getting an error message from weatherbit.io
      if (data.hasOwnProperty("error")){
        return res.status(200).send(body);
      } else {
        responseJson.uv = data.data[0].uv;
        responseJson.status = "OK";
        // Send the response
        res.status(200).send(JSON.stringify(responseJson));
      }
    } else
      return res.status(200).send(JSON.stringify(responseJson));
  });
});

module.exports = router;
