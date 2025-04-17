import React from "react";
import FriendsList from "../components/friends/FriendsList";

// Mock data from stubs
import { sampleUsers } from "../stubs/sampleUsers";

import SearchBar from "../components/navbar/SearchBar";

import { useAuth } from "../contexts/authContext";


function Friends() {
    

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
                <div className="hidden md:block flex-1 max-w-md mx-4 ">
                  <SearchBar />
                </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <SearchBar />
        <FriendsList friends={ sampleUsers } />
      </div>
    </div>
  );
}

export default Friends;