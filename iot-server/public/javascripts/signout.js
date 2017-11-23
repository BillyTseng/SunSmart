function signOut() {
  window.localStorage.removeItem("token");
  window.location = "signin.html";
}

// Register function for signing out.
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('signout').addEventListener('click', function() {
    signOut();
  });
});
