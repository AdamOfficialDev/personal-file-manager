import React, { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

const FileUpload = ({ onFileUploaded, currentFolder }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Use ref to access input file directly
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    setUploadSuccess(false);
  };

  // Handle file upload
  const handleUpload = () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(0); // Reset progress bar
    const totalFiles = selectedFiles.length;
    let uploadedFiles = 0;

    Array.from(selectedFiles).forEach((file) => {
      const fileRef = ref(storage, `${currentFolder}${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress((prevProgress) =>
            Math.round(((uploadedFiles + percentage / 100) / totalFiles) * 100)
          );
        },
        (error) => {
          console.error("Upload error:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            onFileUploaded({ name: file.name, url: downloadURL });
            uploadedFiles += 1;

            if (uploadedFiles === totalFiles) {
              setUploading(false);
              setProgress(100); // Complete progress bar
              setUploadSuccess(true); // Show success message

              // Reset file input after upload is done
              fileInputRef.current.value = null;
              setSelectedFiles([]);

              setTimeout(() => setUploadSuccess(false), 3000); // Hide success after 3 seconds
            }
          });
        }
      );
    });
  };

  return (
    <div className="mb-4 flex flex-col items-start space-y-4">
      {/* Success message above "Choose File" */}
      {uploadSuccess && (
        <div className="alert alert-success">
          <div>
            <span className="font-bold">Upload Success!</span> Your files have
            been uploaded.
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef} // Reference for resetting input
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="file-input file-input-bordered file-input-info w-full max-w-xs"
        />
        <button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="btn btn-primary"
        >
          Upload Files
        </button>
      </div>

      {/* Progress bar below "Choose File" */}
      {uploading && (
        <div className="mt-2">
          <progress
            className="progress progress-primary w-56"
            value={progress}
            max="100"
          />
          <span>{progress}%</span> {/* Display percentage */}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
