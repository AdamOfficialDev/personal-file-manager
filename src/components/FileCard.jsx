import React from "react";

const FileCard = ({ file }) => {
  // Truncate filename to 10 characters
  const truncatedName =
    file.name.length > 10 ? `${file.name.substring(0, 10)}...` : file.name;

  return (
    <div className="card bg-base-100 shadow-md w-full sm:w-auto">
      <figure className="p-2">
        <img
          src={file.url}
          alt={file.name}
          className="rounded w-full h-48 object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="text-sm font-semibold truncate">{truncatedName}</h2>
      </div>
    </div>
  );
};

export default FileCard;
