document.cookie = "userEmail=; expires=Thu, 01 Jan 2024 00:00:00 UTC; path=/;";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    const userSnapshot = await get(ref(database, "users/" + user.uid + "/acc"));
    const userData = userSnapshot.val();

    if (userData) {
      if (userData.verified) {
        alert("Login successful! Welcome " + userData.fullName);
        window.location.href = "./homepage";
      } else {
        alert(
          "Your account is not yet verified. Please check your email for the verification link."
        );
        await auth.signOut();
      }
    } else {
      alert("User data not found!");
    }
  } catch (error) {
    alert("Error, Comeback Later.");
  }
});

const googleProvider = new GoogleAuthProvider();
const googleLoginBtn = document.getElementById("google-login-btn");

googleLoginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userSnapshot = await get(ref(database, "users/" + user.uid + "/acc"));
    const userData = userSnapshot.val();

    if (userData) {
      if (userData.verified) {
        alert("Login successful! Welcome " + userData.fullName);
        window.location.href = "./homepage";
      } else {
        alert(
          "Your account is not yet verified. Please check your email for the verification link."
        );
        await auth.signOut();
      }
    } else {
      alert("User data not found!");
    }
  } catch (error) {
    alert("Error, Comeback Later.");
  }
});
