import React from "react";
import FileCard from "./FileCard";
import { FiFolder } from "react-icons/fi";

const FileList = ({ files, onFolderClick }) => {
  return (
    <div className="flex flex-wrap -mx-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
        >
          {file.url ? (
            <FileCard file={file} />
          ) : (
            <div
              className="card bg-base-100 shadow-xl cursor-pointer"
              onClick={() => onFolderClick(file.name)}
            >
              <div className="flex justify-center items-center h-32">
                <div className="text-6xl text-blue-500">
                  <FiFolder />
                </div>
              </div>
              <div className="card-body items-center text-center">
                <h2 className="text-sm font-semibold">{file.name}</h2>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;
