import React from "react";
import FileCard from "./FileCard";
import { FaRegFolderOpen } from "react-icons/fa6";

const FileList = ({ files, onFolderClick, onFilePreview }) => {
  return (
    <div className="flex flex-wrap -mx-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
        >
          {file.url ? (
            <div onClick={() => onFilePreview(file)}>
              <FileCard file={file} />
            </div>
          ) : (
            <div
              className="card bg-base-100 shadow-xl cursor-pointer"
              onClick={() => onFolderClick(file.name)}
            >
              <div className="flex justify-center items-center h-32">
                <div className="text-[6rem] mt-auto text-blue-500">
                  <FaRegFolderOpen />
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
