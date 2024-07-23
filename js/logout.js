document.addEventListener("DOMContentLoaded", function () {
  const logoutLinks = document.querySelectorAll(
    "#logout-link, #mobile-logout-link"
  );

  logoutLinks.forEach((logoutLink) => {
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();

      const confirmLogout = confirm("Are you sure you want to log out?");

      if (confirmLogout) {
        document.cookie =
          "userEmail=; expires=Thu, 01 Jan 2024 00:00:00 UTC; path=/;";

        alert("Logged out successfully!");
        window.location.href = "./signin";
      } else {
        alert("Logout canceled.");
      }
    });
  });
});
