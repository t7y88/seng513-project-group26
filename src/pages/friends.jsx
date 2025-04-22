import React, { useState } from "react";
import FriendsList from "../components/friends/FriendsList";
import UserSearchBar from "../components/navbar/UserSearchBar";
import { useUserData } from "../contexts/userDataContext/useUserData";

function Friends() {
  const { userData, friends, loading } = useUserData();
  
  // State to hold search results
  const [filteredFriends, setFilteredFriends] = useState([]);

  // Show filtered friends if searching, otherwise show all
  const friendsToDisplay = filteredFriends.length > 0 ? filteredFriends : friends;

  if ( loading || !userData?.id ) {
    return <div className="text-center py-10 text-gray-500">Fetching your friends list...</div>;
  }
  
  if (loading || !userData) {
    return <div className="p-4">Loading user data...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
  {/* Search Bar */}
  <div className="w-full">
    <UserSearchBar
      onSearchResults={setFilteredFriends}
      currentUserId={userData.id}
      placeholder="Search for new friends"
    />
  </div>

  {/* Friends List */}
  <FriendsList friends={friendsToDisplay} />
</div>

    </div>
  );
}

export default Friends;
