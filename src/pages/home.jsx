import React from "react";
import SuggestedHikes from "../components/home/SuggestedHikes";

function Home() {

  return (
    // The default home page for logged in users. 
    // These are just arbitray values for now.
    // Please insert your own values and don't trust these.
    <div className="bg-red-500 h-screen flex flex-col">
      <SuggestedHikes />
    </div>
  );
}

export default Home;
