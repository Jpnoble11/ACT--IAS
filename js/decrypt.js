// Function to reset the form fields and result
function resetForm() {
  document.getElementById("decryptionForm").reset();
  document.getElementById("decryptionResult").textContent = "";
  document.getElementById("downloadLink").style.display = "none";
}

// Add event listener for the cancel button
document.getElementById("cancelButton").addEventListener("click", function () {
  resetForm();
});

function decryptFile(content, key, originalFileName) {
  let confirmed = confirm("Are you sure you want to decrypt this file?");
  if (!confirmed) {
    return;
  }

  let decryptedContent = decrypt(content, key);

  // Create a Blob from the content
  const blob = new Blob([decryptedContent], {
    type: "application/octet-stream",
  });

  // Remove .enc extension to get the original file name
  const originalFileNameWithoutEnc = originalFileName.replace(/\.enc$/, "");

  // Create a temporary anchor element to trigger the download
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = originalFileNameWithoutEnc;
  downloadLink.style.display = "block"; // Show the download button

  // Alert when download link is clicked
  downloadLink.addEventListener("click", function () {
    alert("Downloading decrypted file...");
  });
}

function decrypt(content, key) {
  const keyCharCode = key.charCodeAt(0); // Use the first character of the key for XOR
  const contentArray = new Uint8Array(content);
  const decryptedArray = new Uint8Array(contentArray.length);

  for (let i = 0; i < contentArray.length; i++) {
    decryptedArray[i] = contentArray[i] ^ keyCharCode;
  }

  return decryptedArray.buffer;
}

// Example usage
document
  .getElementById("decryptionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const decryptionKey = document.getElementById("decryptionKey").value;

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      decryptFile(fileContent, decryptionKey, file.name);
      document.getElementById("decryptionResult").textContent =
        "File decrypted successfully!";
    };
    reader.readAsArrayBuffer(file);
  });
