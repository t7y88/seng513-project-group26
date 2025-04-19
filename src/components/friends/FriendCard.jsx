import React, { useEffect, useState } from "react";

import FriendHikePreviewList from "./FriendHikePreviewList";

import { getRecentHikesByFriend, getAllHikes } from "../../firebase/firestore";
import { getMergedRecentHikes } from "../../stubs/helpers/recentHikeMerger";


/*
  FriendCard Component

  Props:
    - friend: an object representing a friend's data.
      Expected properties:
        - username (string)
        - location (string)
        - profileImage (string - URL to image)

    - onViewProfile: a function passed down from the parent (FriendsList)
      This function is called when the "View Profile" button is clicked.
      It receives the 'friend' object as an argument.

  Purpose:
    - Display a visually styled "card" that includes:
        - Friend's profile picture
        - Username
        - Location
        - A button to view their profile (which navigates to another page)
        - Recent hikes (with images, titles, and dates) in a scrollable preview format
*/

function FriendCard({ friend, onViewProfile }) {
  // Local state for this friend's merged hike previews
  const [mergedHikes, setMergedHikes] = useState([]);

  // Fetch and merge recent hikes after mount
  useEffect(() => {
    const loadFriendHikes = async () => {
      try {
        console.log("[FriendCard] friend.id =", friend.id, typeof friend.id === "string");
        const friendCompletedHikes = await getRecentHikesByFriend(friend.id);
        const hikes = getAllHikes();
        const merged = getMergedRecentHikes(friendCompletedHikes, hikes);
        setMergedHikes(merged);
      } catch (err) {
        console.error("Failed to load friend hikes:", err);
        setMergedHikes([]);
      }
    };
  
    loadFriendHikes();
  }, [friend]);
  

  return (
    // Card container: white background, padding, rounded corners, shadow
    // Uses flexbox to space out content horizontally with center alignment
    <div className="bg-white p-4 rounded shadow flex flex-col gap-3">
      {/* Top section: profile info and button */}
      <div className="flex justify-between items-center">
        {/* Left section: profile image and text */}
        <div className="flex items-center gap-4">
          {/* Profile picture in a circular container */}
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={friend.profileImage} // URL to the profile picture
              alt="Profile" // Alternative text for screen readers
              className="w-full h-full object-cover" // Make the image fill and crop as needed
            />
          </div>

          {/* Username and location text */}
          <div>
            <p className="text-lg font-bold">@{friend.username}</p>
            <p className="text-sm text-gray-600">{friend.location}</p>
          </div>
        </div>

        {/* Right section: view profile button */}
        <button
          className="generic-button-active" // Styled button class 
          onClick={() => onViewProfile(friend)} // Calls the function passed via props
        >
          View Profile
        </button>
      </div>

      {/* Recent Hikes list (only if user has completed hikes) */}
      <div className="w-full max-w-md overflow-hidden">
        {mergedHikes.length > 0 && (
          <FriendHikePreviewList hikes={mergedHikes} />
        )}
      </div>
    </div>
  );
}

// Export the component so it can be used in other parts of the app (like FriendsList)
export default FriendCard;
