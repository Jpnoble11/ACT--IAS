import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

// Your web app's Firebase configuration
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
const storage = getStorage(app);

document.getElementById("uploadButton").addEventListener("click", () => {
  const file = document.getElementById("imageUpload").files[0];
  if (file) {
    const storageRef = ref(storage, `Image Folders/${file.name}`);
    document.getElementById("loadingIndicator").style.display = "block";
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        document.getElementById("loadingIndicator").style.display = "none";
        document.getElementById("imageUpload").value = "";
        addImageToAllImagesDisplay(downloadURL, file.name);
      })
      .catch((error) => {
        document.getElementById("loadingIndicator").style.display = "none";
        console.error("Upload failed:", error);
      });
  } else {
    alert("Please select a file first.");
  }
});

function displayAllImages() {
  const storageRef = ref(storage, "Image Folders");
  listAll(storageRef)
    .then((res) => {
      console.log("Listing all items:");
      res.items.forEach((itemRef) => {
        console.log("Found item:", itemRef.name);
        getDownloadURL(itemRef)
          .then((downloadURL) => {
            console.log("Download URL:", downloadURL);
            addImageToAllImagesDisplay(downloadURL, itemRef.name);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Failed to list images:", error);
    });
}
function addImageToAllImagesDisplay(downloadURL, fileName) {
  const allImagesDisplay = document.getElementById("allImagesDisplay");
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const img = document.createElement("img");
  img.src = downloadURL;
  img.alt = fileName;
  img.classList.add("centered-image");

  // Append image to the container
  imageContainer.appendChild(img);
  allImagesDisplay.appendChild(imageContainer);
}

document.addEventListener("DOMContentLoaded", displayAllImages);

document.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    // Adjust the value as needed
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
