// Executes once the google map api is loaded, and then sets up the handler's and calls
// getRecentPotholes() to display the recent potholes
function initMap() {
  var latitude = 32.2319;
  var longitude = -110.9501;

  // Create a map centered at the most recent pothole location
  var uluru = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: uluru
  });
}

// Handle authentication on page load
document.addEventListener("DOMContentLoaded", function() {
   if (!window.localStorage.getItem('token') ) {
      window.location = "signin.html";
   }
});
