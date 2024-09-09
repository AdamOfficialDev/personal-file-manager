import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileManager from "./components/FileManager";
// import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-base-200 p-6">
        <Routes>
          <Route path="/" element={<FileManager />} />
          {/* <Route path="/folder/*" element={<FileManager />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
