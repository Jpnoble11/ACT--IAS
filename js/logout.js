// Check if user email is stored in localStorage
const userEmail = localStorage.getItem("userEmail");

// Get the Log Out link element
const logoutLink = document.querySelector(".navbar ul li:last-child a");

if (userEmail) {
  // User is logged in, show Log Out link
  logoutLink.style.display = "block";
} else {
  // User is not logged in, hide Log Out link
  logoutLink.style.display = "none";
}

// Add event listener for Log Out link
logoutLink.addEventListener("click", function (event) {
  // Prevent default link behavior
  event.preventDefault();

  // Confirm logout
  const confirmLogout = confirm("Are you sure you want to log out?");

  if (confirmLogout) {
    // Clear userEmail from localStorage
    localStorage.removeItem("userEmail");

    // Optionally, redirect to login page or perform other logout actions
    alert("Logged out successfully!");
    window.location.href = "./"; // Redirect to login page after logout
  }
});
