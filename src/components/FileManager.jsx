import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import { storage } from "../firebaseConfig";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { FiX } from "react-icons/fi";

function FileManager() {
  const { "*": folderPath } = useParams();
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk mengontrol modal
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // State untuk menyimpan file yang akan di-preview
  const navigate = useNavigate();
  const currentFolder = folderPath ? `uploads/${folderPath}/` : "uploads/";

  // Fetch files and folders from Firebase Storage
  const fetchFiles = async (folderPath) => {
    try {
      const listRef = ref(storage, folderPath);
      const res = await listAll(listRef);

      const filesPromises = res.items
        .filter((itemRef) => itemRef.name !== ".keep") // Filter out .keep
        .map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url };
        });

      const foldersPromises = res.prefixes.map(async (folderRef) => {
        return { name: folderRef.name, url: "" }; // Folders don't have URLs
      });

      const filesData = await Promise.all([
        ...filesPromises,
        ...foldersPromises,
      ]);
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  // Fetch files when component mounts or folderPath changes
  useEffect(() => {
    fetchFiles(currentFolder);
  }, [folderPath]);

  // Create new folder
  const handleCreateFolder = async () => {
    if (newFolderName.trim() === "") return;

    try {
      const folderRef = ref(storage, `${currentFolder}${newFolderName}/`);
      const dummyFileRef = ref(
        storage,
        `${currentFolder}${newFolderName}/.keep`
      );

      await uploadBytesResumable(dummyFileRef, new Blob(), {
        contentType: "text/plain",
      });

      setFiles((prevFiles) => [...prevFiles, { name: newFolderName, url: "" }]);
      setNewFolderName("");
      setShowModal(false); // Hide modal after creation
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error creating folder: ", error);
    }
  };

  // Handle folder click to navigate
  const handleFolderClick = (folderName) => {
    navigate(
      `/folder/${folderPath ? `${folderPath}/${folderName}` : folderName}`
    );
  };

  // Handle back navigation
  const handleBack = () => {
    const pathParts = folderPath ? folderPath.split("/") : [];
    pathParts.pop(); // Remove the current folder
    const parentPath = pathParts.join("/");
    navigate(parentPath ? `/folder/${parentPath}` : "/folder");
  };

  // Preview File
  const handlePreviewFile = (file) => {
    setPreviewFile(file);
  };

  // Close preview modal
  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  // Breadcrumbs
  const pathParts = folderPath ? folderPath.split("/") : [];
  const breadcrumbLinks = pathParts.map((part, index) => ({
    name: part,
    path: `/folder/${pathParts.slice(0, index + 1).join("/")}`,
  }));

  return (
    <div>
      <div className="flex justify-between mb-4">
        {folderPath && (
          <button className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
        )}
      </div>

      <FileUpload
        onFileUploaded={(newFile) =>
          setFiles((prevFiles) => [...prevFiles, newFile])
        }
        currentFolder={currentFolder}
      />

      {/* Breadcrumbs below "Choose File" */}
      <div className="breadcrumbs text-sm mt-4 mb-4">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {breadcrumbLinks.map((crumb, index) => (
            <li key={index}>
              <Link to={crumb.path}>{crumb.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      <FileList
        files={files}
        onFolderClick={handleFolderClick}
        onFilePreview={handlePreviewFile}
      />

      {/* Modal for file preview */}
      {previewFile && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={handleClosePreview}
            >
              <FiX />
            </button>
            <h3 className="text-lg font-bold mb-4 line-clamp-1">
              {previewFile.name}
            </h3>

            {/* Show preview for image files */}
            {previewFile.url &&
            previewFile.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="w-full rounded-md"
              />
            ) : previewFile.url && previewFile.name.match(/\.(txt)$/i) ? (
              <iframe
                src={previewFile.url}
                title={previewFile.name}
                className="w-full h-64"
              />
            ) : previewFile.url &&
              !previewFile.name.match(/\.(jpg|jpeg|png|gif|txt)$/i) ? (
              <div className="flex flex-col items-center">
                <p>File preview is not available for this file type.</p>
                <a
                  href={previewFile.url}
                  download
                  className="btn btn-primary mt-4"
                >
                  Download
                </a>
              </div>
            ) : (
              <div>File preview is not available for this file type.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal for creating new folder */}
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary fixed bottom-4 right-4"
      >
        <AiOutlineFolderAdd className="text-xl" />
      </button>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              <FiX />
            </button>
            <h3 className="text-lg font-bold">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="input input-bordered w-full mt-4"
            />
            <div className="modal-action">
              <button onClick={handleCreateFolder} className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white p-2 rounded">
          Folder created successfully!
        </div>
      )}
    </div>
  );
}

export default FileManager;
