import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const FileCard = ({ file }) => {
  // Fungsi untuk menentukan ikon berdasarkan tipe file
  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png)$/i)) {
      return null; // Gambar tetap ditampilkan
    } else if (fileName.match(/\.(txt)$/i)) {
      return (
        <i
          className="bi bi-file-earmark-text text-blue-500"
          style={{ fontSize: "48px" }}
        ></i>
      );
    } else if (fileName.match(/\.(pdf)$/i)) {
      return (
        <i
          className="bi bi-file-earmark-pdf text-red-500"
          style={{ fontSize: "48px" }}
        ></i>
      );
    } else if (fileName.match(/\.(zip|rar)$/i)) {
      return (
        <i
          className="bi bi-file-earmark-zip text-yellow-500"
          style={{ fontSize: "48px" }}
        ></i>
      );
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return (
        <i
          className="bi bi-file-earmark-word text-blue-500"
          style={{ fontSize: "48px" }}
        ></i>
      );
    } else if (fileName.match(/\.(xls|xlsx)$/i)) {
      return (
        <i
          className="bi bi-file-earmark-spreadsheet text-green-500"
          style={{ fontSize: "48px" }}
        ></i>
      );
    } else if (fileName.match(/\.(ppt|pptx)$/i)) {
      return (
        <i
          className="bi bi-file-earmark-ppt text-red-500"
          style={{ fontSize: "48px" }}
        ></i>
      );
    } else {
      return (
        <i
          className="bi bi-file-earmark text-slate-300"
          style={{ fontSize: "48px" }}
        ></i>
      );
    }
  };

  return (
    <div className="card bg-base-100 shadow-md w-full sm:w-auto">
      <figure className="p-2">
        {/* Jika file adalah gambar, tampilkan gambar, jika tidak tampilkan ikon */}
        {file.url && file.name.match(/\.(jpg|jpeg|png)$/i) ? (
          <img
            src={file.url}
            alt={file.name}
            className="rounded w-full h-48 object-cover"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-48">
            {getFileIcon(file.name)}
          </div>
        )}
      </figure>
      <div className="card-body p-4">
        <h2 className="text-sm font-semibold line-clamp-1">{file.name}</h2>
      </div>
    </div>
  );
};

export default FileCard;
