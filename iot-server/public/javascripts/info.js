// Handle authentication on page load
document.addEventListener("DOMContentLoaded", function() {
  if (!window.localStorage.getItem('token') ) {
    window.location = "signin.html";
  }
});
