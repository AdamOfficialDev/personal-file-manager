import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const FileCard = ({ file }) => {
  // Fungsi untuk menentukan ikon berdasarkan tipe file
  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png)$/i)) {
      return null; // Gambar tetap ditampilkan
    } else if (fileName.match(/\.(txt)$/i)) {
      return (
        <i className="bi bi-file-earmark-text text-[8rem] text-blue-500"></i>
      );
    } else if (fileName.match(/\.(pdf)$/i)) {
      return (
        <i className="bi bi-file-earmark-pdf text-[8rem] text-red-500"></i>
      );
    } else if (fileName.match(/\.(zip|rar)$/i)) {
      return (
        <i className="bi bi-file-earmark-zip text-[8rem] text-yellow-500"></i>
      );
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return (
        <i className="bi bi-file-earmark-word text-[8rem] text-blue-500"></i>
      );
    } else if (fileName.match(/\.(xls|xlsx)$/i)) {
      return (
        <i className="bi bi-file-earmark-spreadsheet text-[8rem] text-green-500"></i>
      );
    } else if (fileName.match(/\.(ppt|pptx)$/i)) {
      return (
        <i className="bi bi-file-earmark-ppt text-[8rem] text-red-500"></i>
      );
    } else if (fileName.match(/\.(mp3|wav|ogg)$/i)) {
      return (
        <i className="bi bi-file-earmark-music text-[8rem] text-green-500"></i>
      );
    } else if (fileName.match(/\.(mp4)$/i)) {
      return (
        <i className="bi bi-file-earmark-play text-[8rem] text-red-500"></i>
      );
    } else {
      return <i className="bi bi-file-earmark text-[8rem] text-slate-300"></i>;
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
