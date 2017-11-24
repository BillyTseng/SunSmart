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
        '<div class="dropdown-menu" id="' + device.deviceId + '">' +
          '<a class="dropdown-item">Edit</a>' +
          '<a class="dropdown-item">Delete</a>' +
        '</div>' +
      '</div>';

    $('#deviceTable > tbody:last-child').append('<tr>' + '<td>'+ dropDownHtml + '</td>' +
                                                '<td>'+ device.deviceId + '</td>' +
                                                '<td>'+ device.apikey + '</td>' + '</tr>');

    $("#" + device.deviceId + " a:contains('Delete')").click(
      {deviceId: device.deviceId}, deviceIdDelete);

    $("#" + device.deviceId + " a:contains('Edit')").click(
      {deviceId: device.deviceId}, deviceIdEdit);
  }
}

function deviceIdEdit(event) {
  console.log(event.data.deviceId + ": Edit");
}

function deviceIdDelete(event) {
  console.log(event.data.deviceId + ": Delete");
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
  var deviceIdValue = $("#deviceId").val();
  var dropDownHtml = "" +
    '<div class="btn-group d-flex justify-content-center">' +
      '<button type="button" class="btn btn-secondary dropdown-toggle"' +
      ' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        'Actions' +
      '</button>' +
      '<div class="dropdown-menu" id="' + deviceIdValue + '">' +
        '<a class="dropdown-item">Edit</a>' +
        '<a class="dropdown-item">Delete</a>' +
      '</div>' +
    '</div>';

  // Add new device to the device table
  $('#deviceTable > tbody:last-child').append('<tr>' + '<td>'+ dropDownHtml + '</td>' +
                                            '<td>'+ deviceIdValue +'</td>' +
                                            '<td>'+ data["apikey"] + '</td>' + '</tr>');

  $("#" + deviceIdValue + " a:contains('Delete')").click(
    {deviceId: deviceIdValue}, deviceIdDelete);

  $("#" + deviceIdValue + " a:contains('Edit')").click(
    {deviceId: deviceIdValue}, deviceIdEdit);

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

function showEditUserInfo() {
  var emailText = $("#email").text();
  var fullNameText = $("#fullName").text();
  $("#editUserInfo").hide();
  $("#confirmEditUserInfo").show();
  $("#email").html('<input type="email" col="50" value=' + '"' + emailText + '">');
  $("#fullName").html('<input type="email" col="50" value=' + '"' + fullNameText + '">');
  $("#confirmEditUserInfo a:contains('Cancel')").click(
    {
      orgEmail: emailText,
      orgName: fullNameText
    }, abortEditUserInfo);

  // User press done, PUT new user info to server.
  $("#confirmEditUserInfo a:contains('Done')").click(
    {
      orgEmail: emailText
    }, editUserInfo);
}

function abortEditUserInfo(event) {
  $("#editUserInfo").show();
  $("#confirmEditUserInfo").hide();
  $("#email").html(event.data.orgEmail);
  $("#fullName").html(event.data.orgName);
}

function editUserInfo(event) {
  var inputEmail = $("#email input").val();
  var inputName = $("#fullName input").val();

  $.ajax({
    url: '/users/edit',
    type: 'PUT',
    headers: { 'x-auth': window.localStorage.getItem("token") },
    data: { email: inputEmail, fullName: inputName },
    responseType: 'json',
    success: function(data, status, xhr) {
      // If email is revised, have to re-login to update token.
      if (event.data.orgEmail !== inputEmail) {
        // The signOut() is in signout.js
        signOut();
      } else {
        $("#editUserInfo").show();
        $("#confirmEditUserInfo").hide();
        $("#email").html(inputEmail);
        $("#fullName").html(inputName);
      }
    },
    error: function(jqXHR, status, error) {
      var response = JSON.parse(jqXHR.responseText);
      $("#error").html("Error: " + response.message);
      $("#error").show();
    }
  });
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
  $("#editUserInfo").click(showEditUserInfo);
});
