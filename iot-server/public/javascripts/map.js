// GET the uv record
function getUVRecord() {
  $.ajax({
      url: '/record/all',
      type: 'GET',
      responseType: 'json',
      success: markUVRecord,
      error: function(jqXHR, status, error) {
        if (status === 401) {
            window.localStorage.removeItem("token");
            window.location = "signin.html";
        } else {
           alert(error);
        }
      }
  });
}

function markUVRecord(data, status, xhr) {
  var latitude = 32.2319;
  var longitude = -110.9501;

  // Create a map centered at the location
  var uluru = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: uluru
  });

  var json = $.parseJSON(data);
  // Add markers for all record
  for (var rec of json.record) {
    uluru = {lat: rec.latitude, lng: rec.longitude};
    var marker = new google.maps.Marker({
       position: uluru,
       map: map,
       label: {
          text: "" + rec.uv,
          color: 'white',
          fontSize: "14px"
       },
    });
  }
}

// Executes once the google map api is loaded, and then sets up and calls the handler
function initMap() {
  getUVRecord();
}

// Handle authentication on page load
document.addEventListener("DOMContentLoaded", function() {
   if (!window.localStorage.getItem('token') ) {
      window.location = "signin.html";
   }
});
