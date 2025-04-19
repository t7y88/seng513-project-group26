import React from "react";
import FriendsList from "../components/friends/FriendsList";

import SearchBar from "../components/navbar/SearchBar";

import { useUserData } from "../contexts/userDataContext";


function Friends() {
  const { userData, completedHikes, friends, loading } = useUserData();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="hidden md:block flex-1 max-w-md mx-4 ">
        <SearchBar />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">

        <FriendsList friends = { friends } />
      </div>
    </div>
  );
}

export default Friends;