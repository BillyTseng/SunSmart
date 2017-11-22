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
          } else {
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

  // Add the devices to the table
  for (var device of data.devices) {
    var dropDownHtml = "" +
      '<div class="btn-group d-flex justify-content-center">' +
        '<button type="button" class="btn btn-secondary dropdown-toggle"' +
        ' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
          'Actions' +
        '</button>' +
        '<div class="dropdown-menu">' +
          '<a class="dropdown-item" href="#">Edit</a>' +
          '<a class="dropdown-item" href="#">Delete</a>' +
        '</div>' +
      '</div>';

    $('#deviceTable > tbody:last-child').append('<tr>' + '<td>'+ dropDownHtml + '</td>' +
                                                '<td>'+ device.deviceId + '</td>' +
                                                '<td>'+ device.apikey + '</td>' + '</tr>');
  }
}

// Registers the specified device with the server.
function registerDevice() {
    $.ajax({
        url: '/device/register',
        type: 'POST',
        headers: { 'x-auth': window.localStorage.getItem("token") },
        data: { deviceId: $("#deviceId").val() },
        responseType: 'json',
        success: deviceRegistered,
        error: function(jqXHR, status, error) {
            var response = JSON.parse(jqXHR.responseText);
            $("#error").html("Error: " + response.message);
            $("#error").show();
        }
    });
}

// Device successfully register. Update the table of devices and hide the add device form
function deviceRegistered(data, status, xhr) {
  var dropDownHtml = "" +
    '<div class="btn-group d-flex justify-content-center">' +
      '<button type="button" class="btn btn-secondary dropdown-toggle"' +
      ' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        'Actions' +
      '</button>' +
      '<div class="dropdown-menu">' +
        '<a class="dropdown-item" href="#">Edit</a>' +
        '<a class="dropdown-item" href="#">Delete</a>' +
      '</div>' +
    '</div>';

  // Add new device to the device table
  $('#deviceTable > tbody:last-child').append('<tr>' + '<td>'+ dropDownHtml + '</td>' +
                                            '<td>'+ $("#deviceId").val() +'</td>' +
                                            '<td>'+ data["apikey"] + '</td>' + '</tr>');
  hideAddDeviceForm();
}

// Show add device form and hide the add device button (really a link)
function showAddDeviceForm() {
   $("#deviceId").val("");           // Clear the input for the device ID
   $("#addDeviceControl").hide();    // Hide the add device link
   $("#addDeviceForm").slideDown();  // Show the add device form
}

// Hides the add device form and shows the add device button (link)
function hideAddDeviceForm() {
   $("#addDeviceControl").show();  // Hide the add device link
   $("#addDeviceForm").slideUp();  // Show the add device form
   $("#error").hide();
}
// Handle authentication on page load
$(function() {
  if( !window.localStorage.getItem('token') ) {
    window.location = "signin.html";
  } else {
    sendReqForStatus();
  }

  // Register event listeners
  $("#addDevice").click(showAddDeviceForm);
  $("#registerDevice").click(registerDevice);
  $("#cancel").click(hideAddDeviceForm);
});
