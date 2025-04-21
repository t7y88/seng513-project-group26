import React from "react";
import SuggestedHikes from "../components/home/SuggestedHikes";
import FriendLog from "../components/home/FriendLog";
function Home() {

  return (
    // The default home page for logged in users. 
    
    <div className="bg-gray-100 min-h-screen flex flex-col overflow-y-auto">
      <SuggestedHikes />
      <FriendLog/>
    </div>
  );
}

export default Home;
