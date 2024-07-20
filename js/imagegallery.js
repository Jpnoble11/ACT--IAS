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

document.getElementById("uploadButton").addEventListener("click", async () => {
  const file = document.getElementById("imageUpload").files[0];
  if (file) {
    try {
      const encryptedBlob = await encryptFile(file, "9999"); // Replace 'your-secret-key' with your actual key
      const storageRef = ref(storage, `Image Folders/${file.name}`);
      document.getElementById("loadingIndicator").style.display = "block";
      const snapshot = await uploadBytes(storageRef, encryptedBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      document.getElementById("loadingIndicator").style.display = "none";
      document.getElementById("imageUpload").value = "";
      addImageToAllImagesDisplay(downloadURL, file.name);
    } catch (error) {
      document.getElementById("loadingIndicator").style.display = "none";
      console.error("Upload failed:", error);
    }
  } else {
    alert("Please select a file first.");
  }
});

async function encryptFile(file, secretKey) {
  const arrayBuffer = await file.arrayBuffer();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization Vector
  const encryptedArrayBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    arrayBuffer
  );
  const encryptedBlob = new Blob([iv, encryptedArrayBuffer]); // Prepend IV to the encrypted data
  return encryptedBlob;
}

async function decryptFile(encryptedBlob, secretKey) {
  const arrayBuffer = await encryptedBlob.arrayBuffer();
  const iv = arrayBuffer.slice(0, 12); // Extract IV
  const encryptedData = arrayBuffer.slice(12); // Extract encrypted data
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  const decryptedArrayBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encryptedData
  );
  return new Blob([decryptedArrayBuffer]);
}

function displayAllImages() {
  const storageRef = ref(storage, "Image Folders");
  listAll(storageRef)
    .then((res) => {
      console.log("Listing all items:");
      res.items.forEach((itemRef) => {
        console.log("Found item:", itemRef.name);
        getDownloadURL(itemRef)
          .then(async (downloadURL) => {
            const response = await fetch(downloadURL);
            const encryptedBlob = await response.blob();
            const decryptedBlob = await decryptFile(encryptedBlob, "9999"); // Use the same secret key
            const imageUrl = URL.createObjectURL(decryptedBlob);
            addImageToAllImagesDisplay(imageUrl, itemRef.name);
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

function addImageToAllImagesDisplay(imageUrl, fileName) {
  const allImagesDisplay = document.getElementById("allImagesDisplay");
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const img = document.createElement("img");
  img.src = imageUrl;
  img.alt = fileName;
  img.classList.add("centered-image");

  // Append image to the container
  imageContainer.appendChild(img);
  allImagesDisplay.appendChild(imageContainer);
}

document.addEventListener("DOMContentLoaded", displayAllImages);
