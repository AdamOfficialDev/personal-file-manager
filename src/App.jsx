import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileManager from "./components/FileManager";
import StorageInfo from "./pages/StorageInfo";

// import Home from "./components/Home"; // Jika masih ada Home atau komponen lain

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-200 p-6">
        <Routes>
          {/* Rute utama yang mengarah ke FileManager */}
          <Route path="/" element={<FileManager />} />
          {/* Rute lain jika ada */}
          <Route path="/folder/*" element={<FileManager />} />
          {/* Misalnya rute lain yang mungkin ada */}
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/storage-info" element={<StorageInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
