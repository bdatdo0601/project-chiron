import React from "react";
import Particles from "react-tsparticles";

import "./index.css";
import ParticlesConfig from "./ParticlesConfig";

const Home = () => {
  return (
    <div className="h-screen w-screen p-5 text-center grid content-center grid-cols-1 relative">
      <Particles
        className="particles fixed h-full w-full bg-blue-300"
        options={ParticlesConfig}
        style={{ zIndex: -9999 }}
      />
      <h1 className="font-bold text-8xl my-5 text-white">
        Project Chiron 🏹 
      </h1>
      <h2 className="text-4xl my-4 text-white">
        A different kind of learning platform
      </h2>
      <h6 className="text-xl my-2 underline"><a className="text-blue-400" href="https://datdo.notion.site/Proposal-Project-Chiron-4adda27de97d40e18987350b554b8fbb">Coming Soon... ?</a></h6>
    </div>
  );
};

export default Home;
