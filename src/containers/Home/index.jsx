import React from "react";

import logo from "../../assets/VietTechMainLogo.png";
import "./index.css";

const Home = () => {
  return (
    <div className="h-screen w-screen p-5 text-center grid content-center grid-cols-1 relative bg-black">
      <div className="bg fixed h-full w-full " />
      <h1 className="font-bold text-8xl text-white"><img src={logo} alt="Viet Tech"/></h1>
      <h2 className="text-4xl my-4 text-white">
        Project Chiron 🏹
      </h2>
      <h6 className="text-xl my-2 underline">Coming Soon...</h6>
    </div>
  );
};

export default Home;

