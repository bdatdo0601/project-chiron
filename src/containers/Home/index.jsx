import React from "react";

import "./index.css";

const Home = () => {
  return (
    <div className="h-screen w-screen p-5 text-center grid content-center grid-cols-1 relative bg-blue-400">
      <div className="bg fixed h-full w-full " />
      <h1 className="font-bold text-8xl my-5 text-white">Project Chiron 🏹</h1>
      <h2 className="text-4xl my-4 text-white">
        Some kind of learning platform?
      </h2>
      <h6 className="text-xl my-2 underline">Coming Soon...</h6>
    </div>
  );
};

export default Home;
