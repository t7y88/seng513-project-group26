import React from "react";
import SuggestedHikes from "../components/home/SuggestedHikes";

function Home() {

  return (
    // The default home page for logged in users. 
    // These are just arbitray values for now.
    // Please insert your own values and don't trust these.
    <div className="bg-gray-100 h-screen flex flex-row overflow-y-auto">
      <SuggestedHikes />
    </div>
  );
}

export default Home;
