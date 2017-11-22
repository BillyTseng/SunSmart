// GET the user status and list of devices
function sendReqForStatus() {
    $.ajax({
        url: '/users/status',
        type: 'GET',
        headers: { 'x-auth': window.localStorage.getItem("token") },
        responseType: 'json',
        success: statusResponse,
        error: function(jqXHR, status, error) {
          if (status === 401) {
              window.localStorage.removeItem("token");
              window.location = "signin.html";
          }
          else {
             $("#error").html("Error: " + error);
             $("#error").show();
          }
        }
    });
}

// Update page to display user's account information and list of devices with apikeys
function statusResponse(data, status, xhr) {
    $("#main").show();

    $("#email").html(data.email);
    $("#fullName").html(data.fullName);
    $("#lastAccess").html(data.lastAccess);

    // Add the devices to the list before the list item for the add device button (link)
    for (var device of data.devices) {
      $("#addDeviceForm").before("<div>ID: " +
         device.deviceId + ", APIKEY: " + device.apikey + "</div>")
    }
}

// Handle authentication on page load
$(function() {
  if( !window.localStorage.getItem('token') ) {
    window.location = "signin.html";
  }
  else {
    sendReqForStatus();
  }

  // Register event listeners
  //$("#addDevice").click(showAddDeviceForm);
  //$("#registerDevice").click(registerDevice);
  //$("#cancel").click(hideAddDeviceForm);
});
