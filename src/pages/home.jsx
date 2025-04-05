import React from "react";
import HikeCard from "../components/home/HikeCard";


function Home() {

  return (
    // The default home page for logged in users. 
    // These are just arbitray values for now.
    // Please insert your own values and don't trust these.
    <div className="bg-red-500 h-screen flex items-center justify-center">

      <HikeCard />
    </div>
  );
}

export default Home;
