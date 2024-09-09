import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to the File Manager</h1>
      <Link to="/folder" className="btn btn-primary">
        Go to File Manager
      </Link>
    </div>
  );
};

export default Home;
