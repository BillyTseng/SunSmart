// Initiates an Ajax call to a POST endpoint for sign in
// TODOcosts for a specifed shipping carrier and service type
function showMsg(htmlmsg) {
  var responseDiv = document.getElementById('ServerResponse');
  responseDiv.style.display = "block";
  responseDiv.innerHTML = htmlmsg;
}

function sendReqForSignup() {
  var email = document.getElementById("email").value;
  var fullName = document.getElementById("fullName").value;
  var password = document.getElementById("password").value;
  var passwordConfirm = document.getElementById("passwordConfirm").value;

  if (!isEmailLegal(email)) {
    return;
  }

  if (!password || 0 === password.length) {
    return alert("Error: password field is blank!!");
  }

  if (password != passwordConfirm) {
    showMsg("<p>Password does not match</p>");
    return;
  }
  // Create the XMLHttpRequest object, register the load event
  // listener, and set the response type to JSON
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", signUpResponse);
  xhr.responseType = "json";

  xhr.open("POST", '/users/signup');

  // Send the request
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(JSON.stringify({email:email,fullName:fullName, password:password}));
}

// Response listener for the Ajax call for getting the shippign cost results
function signUpResponse() {
  var responseDiv = document.getElementById('ServerResponse');
  var responseHTML = "";

  // 200 is the response code for a successful GET request
  if (this.status === 201) {
    if (this.response.success) {
      // Change current location of window to response's redirect
      window.location = this.response.redirect;
      var el = $('#ServerResponse');
      el.removeClass('alert-danger');
      el.addClass('alert-success');
      responseHTML = "Sign Up Success!  Redirecting Sign in page...";
    } else {
      responseHTML += "<ol class='ServerResponse'>";
      for( key in this.response) {
        responseHTML += "<li> " + key + ": " + this.response[key] + "</li>";
      }
      responseHTML += "</ol>";
    }
  } else {
    responseHTML = "Error: " + this.response.message;
  }

  // Update the response div in the webpage and make it visible
  responseDiv.style.display = "block";
  responseDiv.innerHTML = responseHTML;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("signup").addEventListener("click", sendReqForSignup);
});
