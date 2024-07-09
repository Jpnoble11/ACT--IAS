document.addEventListener("DOMContentLoaded", function () {
  // Get the Log Out link elements
  const logoutLinks = document.querySelectorAll(
    "#logout-link, #mobile-logout-link"
  );

  // Add event listener for Log Out links
  logoutLinks.forEach((logoutLink) => {
    logoutLink.addEventListener("click", function (event) {
      // Prevent default link behavior
      event.preventDefault();

      // Confirm logout
      const confirmLogout = confirm("Are you sure you want to log out?");

      if (confirmLogout) {
        // Clear session cookie
        document.cookie =
          "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Optionally, redirect to login page or perform other logout actions
        alert("Logged out successfully!");
        window.location.href = "login.html"; // Redirect to login page after logout
      } else {
        // User canceled the logout
        alert("Logout canceled.");
      }
    });
  });
});
