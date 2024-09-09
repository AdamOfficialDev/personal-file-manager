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

function FileManager() {
  const { "*": folderPath } = useParams();
  const [files, setFiles] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
      setShowNewFolderInput(false); // Hide input after creation
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
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          {breadcrumbLinks.map((crumb, index) => (
            <li key={index}>
              <Link to={crumb.path}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  ></path>
                </svg>
                {crumb.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <FileList files={files} onFolderClick={handleFolderClick} />

      <div className="fixed bottom-4 right-4 flex items-center space-x-2">
        {showNewFolderInput && (
          <>
            <input
              type="text"
              placeholder="New Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="input input-bordered"
            />
            <button onClick={handleCreateFolder} className="btn btn-primary">
              <AiOutlineFolderAdd className="text-xl" />
            </button>
          </>
        )}
        <button
          onClick={() => setShowNewFolderInput(!showNewFolderInput)}
          className="btn btn-secondary"
        >
          {showNewFolderInput ? "Cancel" : "New Folder"}
        </button>
      </div>

      {showSuccessMessage && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white p-2 rounded">
          Folder created successfully!
        </div>
      )}
    </div>
  );
}

export default FileManager;
