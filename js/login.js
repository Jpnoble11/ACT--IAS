document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGZDCphcVOI-CX808hT47KAgihFI2LOaE",
  authDomain: "iasdb-f3496.firebaseapp.com",
  databaseURL:
    "https://iasdb-f3496-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iasdb-f3496",
  storageBucket: "iasdb-f3496.appspot.com",
  messagingSenderId: "468474107017",
  appId: "1:468474107017:web:98677254871c76110d6258",
  measurementId: "G-FLQ1YMY8VQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Reference to the login form element
const loginForm = document.getElementById("login-form");

// Login form submit event listener
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input values
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    // Sign in user with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the user object from the userCredential
    const user = userCredential.user;

    // Store user email in a cookie
    document.cookie = `userEmail=${email}; path=/`;

    // Retrieve user data from database
    const userSnapshot = await get(ref(database, "users/" + user.uid + "/acc"));
    const userData = userSnapshot.val();

    if (userData) {
      alert("Login successful! Welcome " + userData.fullName);
      window.location.href = "homepage.html";
    } else {
      alert("User data not found!");
    }
  } catch (error) {
    alert(error.message);
  }
});
