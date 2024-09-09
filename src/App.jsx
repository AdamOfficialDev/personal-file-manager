import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileManager from "./components/FileManager";
// import Home from "./components/Home"; // Jika masih ada Home atau komponen lain

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute utama yang mengarah ke FileManager */}
        <Route path="/" element={<FileManager />} />
        {/* Rute lain jika ada */}
        <Route path="/folder/*" element={<FileManager />} />
        {/* Misalnya rute lain yang mungkin ada */}
        {/* <Route path="/home" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
