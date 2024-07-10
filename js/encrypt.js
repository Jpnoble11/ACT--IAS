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

function encryptFile(content, key, originalFileName, callback) {
  const keyCharCode = key.charCodeAt(0); // Use the first character of the key for XOR
  const contentArray = new Uint8Array(content);
  const encryptedArray = new Uint8Array(contentArray.length);

  for (let i = 0; i < contentArray.length; i++) {
    encryptedArray[i] = contentArray[i] ^ keyCharCode;
  }

  const blob = new Blob([encryptedArray], {
    type: "application/octet-stream",
  });

  const encryptedFileName = originalFileName + ".enc";

  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = encryptedFileName;
  downloadLink.style.display = "block";

  // Set up event listener for download link click
  downloadLink.addEventListener("click", function () {
    const confirmDownload = confirm(
      "File encrypted successfully! Do you want to download it?"
    );
    if (confirmDownload) {
      // Call the callback to reset the form after download
      callback();
    } else {
      event.preventDefault(); // Prevent the default action if not confirmed
    }
  });
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
      encryptFile(fileContent, encryptionKey, file.name, resetForm);
      document.getElementById("encryptionResult").textContent =
        "File encrypted successfully!";
    };
    reader.readAsArrayBuffer(file);
  });
