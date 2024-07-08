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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const filesRef = database.ref("files");

// Function to handle file upload
document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    const userEmail = localStorage.getItem("userEmail");

    if (!file || !userEmail) {
      alert("Please select a file and log in first.");
      return;
    }

    try {
      // Read file content as ArrayBuffer
      const fileData = await readFileAsync(file);

      // Encrypt file data
      const encryptedData = encryptData(fileData);

      // Convert encrypted data to Blob
      const encryptedBlob = new Blob([encryptedData], { type: file.type });

      // Upload encrypted file to Firebase Storage
      const fileName = file.name + ".enc";
      const userFilesRef = filesRef.child(userEmail).child(fileName);
      await userFilesRef.put(encryptedBlob);

      // Store email in Realtime Database
      await database.ref("files/" + userEmail).set({ email: userEmail });

      // Clear input and show success message
      document.getElementById("uploadResult").textContent =
        "File uploaded successfully!";
      document.getElementById("uploadResult").classList.remove("error");
      document.getElementById("uploadResult").classList.add("success");

      // Update file list
      updateFileList(userEmail);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  });

// Function to read file content as ArrayBuffer
function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsArrayBuffer(file);
  });
}

// Function to update the file list
function updateFileList(userEmail) {
  const fileList = document.getElementById("fileList");

  filesRef
    .child(userEmail)
    .once("value")
    .then((snapshot) => {
      fileList.innerHTML = ""; // Clear previous list

      snapshot.forEach((childSnapshot) => {
        const fileName = childSnapshot.key.replace(".enc", "");
        const li = document.createElement("li");
        li.textContent = fileName;

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.addEventListener("click", () => {
          // Download and decrypt file
          downloadAndDecryptFile(fileName, userEmail);
        });

        li.appendChild(downloadButton);
        fileList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
      alert("Error fetching files. Please try again.");
    });
}

// Function to download and decrypt file from Firebase Storage
async function downloadAndDecryptFile(fileName, userEmail) {
  try {
    // Get encrypted file from Firebase Storage
    const fileSnapshot = await filesRef
      .child(userEmail)
      .child(fileName + ".enc")
      .getDownloadURL();
    const response = await fetch(fileSnapshot);
    const encryptedData = await response.arrayBuffer();

    // Decrypt file data
    const decryptedData = decryptData(new Uint8Array(encryptedData));

    // Create decrypted Blob
    const decryptedBlob = new Blob([decryptedData], {
      type: response.headers.get("content-type"),
    });

    // Create download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(decryptedBlob);
    downloadLink.download = fileName; // Original file name without .enc extension
    downloadLink.click();

    // Alert for successful download
    alert("File downloaded successfully!");
  } catch (error) {
    console.error("Error downloading file:", error);
    alert("Error downloading file. Please try again.");
  }
}

// Mock encryption function (replace with your actual encryption logic)
function encryptData(data) {
  // Example: XOR encryption
  const key = 42; // Example encryption key
  const encryptedData = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encryptedData[i] = data[i] ^ key;
  }
  return encryptedData;
}

// Mock decryption function (replace with your actual decryption logic)
function decryptData(data) {
  // Example: XOR decryption
  const key = 42; // Example encryption key (must match encryption key)
  const decryptedData = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    decryptedData[i] = data[i] ^ key;
  }
  return decryptedData;
}

// Initialize the file list on page load
window.onload = function () {
  const userEmail = localStorage.getItem("userEmail");
  if (userEmail) {
    updateFileList(userEmail);
  }
};
