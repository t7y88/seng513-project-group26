import React from "react";
import FriendsList from "../components/friends/FriendsList";

// Mock data from stu
import { sampleUsers } from "../stubs/sampleUsers";



function Friends() {
    

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
      <FriendsList friends={sampleUsers} />
      </div>
    </div>
  );
}

export default Friends;