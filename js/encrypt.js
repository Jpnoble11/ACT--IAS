// Function to reset the form fields and result
function resetForm() {
  document.getElementById("encryptionForm").reset();
  document.getElementById("encryptionResult").textContent = "";
  document.getElementById("downloadLink").style.display = "none";
}

// Add event listener for the cancel button
document.getElementById("cancelButton").addEventListener("click", function () {
  resetForm();
});

function encryptFile(content, key, originalFileName) {
  let encryptedContent = encrypt(content, key);

  // Create a Blob from the content
  const blob = new Blob([encryptedContent], {
    type: "application/octet-stream",
  });

  // Append .enc to the original file name
  const encryptedFileName = originalFileName + ".encrypted";

  // Create a temporary anchor element to trigger the download
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = encryptedFileName;
  downloadLink.style.display = "block"; // Show the download button
}

function encrypt(content, key) {
  const keyCharCode = key.charCodeAt(0); // Use the first character of the key for XOR
  const contentArray = new Uint8Array(content);
  const encryptedArray = new Uint8Array(contentArray.length);

  for (let i = 0; i < contentArray.length; i++) {
    encryptedArray[i] = contentArray[i] ^ keyCharCode;
  }

  return encryptedArray.buffer;
}

// Example usage
document
  .getElementById("encryptionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const fileInput = document.getElementById("fileInput");
    const encryptionKey = document.getElementById("encryptionKey").value;

    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const fileContent = event.target.result;
      encryptFile(fileContent, encryptionKey, file.name);
      document.getElementById("encryptionResult").textContent =
        "File encrypted successfully!";
    };
    reader.readAsArrayBuffer(file);
  });
