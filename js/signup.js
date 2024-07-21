import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  update,
  get,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
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

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const hashedPassword = await hashPassword(password);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    await sendEmailVerification(user);

    await set(ref(database, "users/" + user.uid + "/acc"), {
      fullName: fullName,
      username: username,
      email: email,
      password: hashedPassword,
      verified: false,
    });

    displayPopup("Verification email sent. Please check your email.");

    const checkEmailVerified = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        clearInterval(checkEmailVerified);
        await update(ref(database, "users/" + user.uid + "/acc"), {
          verified: true,
        });
        displayPopup(
          "Your account has been verified. You have successfully signed up!",
          () => {
            window.location.href = "signin.html";
          }
        );
      }
    }, 2000);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("The email address is already in use by another account.");
      signupForm.reset();
    } else {
      alert(error.message);
    }
  }
});

const googleProvider = new GoogleAuthProvider();
const googleSignupBtn = document.getElementById("google-signup-btn");

googleSignupBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userSnapshot = await get(ref(database, "users/" + user.uid + "/acc"));
    const userData = userSnapshot.val();

    if (userData) {
      if (userData.verified) {
        alert("Your Google account is already registered!");
        window.location.href = "signin.html";
      } else {
        alert(
          "Your Google account is registered but not yet verified. Please check your email."
        );
      }
    } else {
      await set(ref(database, "users/" + user.uid + "/acc"), {
        fullName: user.displayName,
        username: user.email.split("@")[0],
        email: user.email,
        verified: user.emailVerified,
      });

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        displayPopup("Verification email sent. Please check your email.");

        const checkEmailVerified = setInterval(async () => {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(checkEmailVerified);
            await update(ref(database, "users/" + user.uid + "/acc"), {
              verified: true,
            });
            displayPopup(
              "Your account has been verified. You have successfully signed up!",
              () => {
                window.location.href = "signin.html";
              }
            );
          }
        }, 2000);
      } else {
        displayPopup(
          "Your account has been verified. You have successfully signed up!",
          () => {
            window.location.href = "signin.html";
          }
        );
      }
    }
  } catch (error) {
    alert(error.message);
  }
});

function displayPopup(message, callback) {
  const popup = document.getElementById("verification-popup");
  const messageElem = document.getElementById("verification-message");
  const closeBtn = document.getElementsByClassName("close")[0];

  messageElem.textContent = message;
  popup.style.display = "block";

  closeBtn.onclick = function () {
    popup.style.display = "none";
    if (callback) callback();
  };

  window.onclick = function (event) {
    if (event.target == popup) {
      popup.style.display = "none";
      if (callback) callback();
    }
  };
}
