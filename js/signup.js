// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
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

// SHA-256 hashing function
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// Reference to the signup form element
const signupForm = document.getElementById("signup-form");

// Signup form submit event listener
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user input values
  const fullName = document.getElementById("full-name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user with email and hashed password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the user object from the userCredential
    const user = userCredential.user;

    // Save additional user info to database under 'users/<user-uid>/acc'
    await set(ref(database, "users/" + user.uid + "/acc"), {
      fullName: fullName,
      username: username,
      email: email,
      password: hashedPassword,
    });

    // Redirect or show success message
    alert("User signed up successfully!");
    window.location.href = "./";
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("The email address is already in use by another account.");
      signupForm.reset();
    } else {
      alert(error.message);
    }
  }
});
