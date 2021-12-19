import React from "react";
import Particles from "react-tsparticles";

import ParticlesConfig from "./ParticlesConfig";

const Home = () => {
  return (
    <div className="h-screen w-screen p-5 text-center grid content-center grid-cols-1 relative">
      <Particles
        className="absolute h-full w-full bg-blue-300 z-0"
        options={ParticlesConfig}
      />
      <h1 className="font-bold text-8xl my-5 z-10 text-white">
        🏹 Project Chiron
      </h1>
      <h2 className="text-4xl my-4 z-10 text-white">
        Just another simple platform for your portfolio
      </h2>
      <h4 className="text-2xl my-2 z-10 text-white">Coming Soon...</h4>
    </div>
  );
};

export default Home;
