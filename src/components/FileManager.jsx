import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false); // State to control input visibility
  const navigate = useNavigate();
  const currentFolder = folderPath ? `uploads/${folderPath}/` : "uploads/";

  // Fetch files and folders from Firebase Storage
  const fetchFiles = async (folderPath) => {
    try {
      const listRef = ref(storage, folderPath);
      const res = await listAll(listRef);

      const filesPromises = res.items.map(async (itemRef) => {
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

      // Filter out .keep files
      const filteredFiles = filesData.filter((file) => file.name !== ".keep");
      setFiles(filteredFiles);
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

      // Create dummy .keep file to make folder visible
      await uploadBytesResumable(dummyFileRef, new Blob(), {
        contentType: "text/plain",
      });

      setFiles((prevFiles) => [...prevFiles, { name: newFolderName, url: "" }]);
      setNewFolderName("");
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setShowNewFolderInput(false); // Hide the input after folder creation
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
      <FileList files={files} onFolderClick={handleFolderClick} />

      {/* Button to show input for new folder name */}
      <div className="fixed bottom-4 right-4 flex items-center space-x-2">
        {!showNewFolderInput ? (
          // Show the button to add a folder when input is not visible
          <button
            onClick={() => setShowNewFolderInput(true)} // Show input when clicked
            className="btn btn-primary"
          >
            <AiOutlineFolderAdd className="text-xl" />
          </button>
        ) : (
          // Show input for new folder name
          <>
            <input
              type="text"
              placeholder="New Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="input input-bordered"
            />
            <button onClick={handleCreateFolder} className="btn btn-primary">
              Create
            </button>
          </>
        )}
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
