import React, { useEffect, useState, useRef } from "react";

import FriendHikePreviewList from "./FriendHikePreviewList";
import { getRecentHikesByFriend, getAllHikesAsMap } from "../../firebase/";
import { getMergedRecentHikes } from "../../stubs/helpers/recentHikeMerger";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
  // Local state for this friend's merged hike previews
  const [mergedHikes, setMergedHikes] = useState([]);

  // For horizontal scrolling
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 100; // pixels to scroll

    if (container) {
      container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

// Fetch and merge recent hikes after mount
    useEffect(() => {
    const loadFriendHikes = async () => {
      try {
        const friendCompletedHikes = await getRecentHikesByFriend(friend.id);
        const hikeEntities = await getAllHikesAsMap();
        const merged = getMergedRecentHikes(friendCompletedHikes, hikeEntities);
        setMergedHikes(merged);
      } catch (err) {
        console.error("Failed to load friend hikes:", err);
        setMergedHikes([]);
      }
    };

    loadFriendHikes()},
    [friend]);

  // Card container: full width, white background, padding, rounded corners, shadow
    // `flex flex-col gap-4` stacks children vertically with spacing
return (
    // Card container: full width, white background, padding, rounded corners, shadow
    // `flex flex-col gap-4` stacks children vertically with spacing
    <div className="w-full bg-gray-160 p-4 rounded shadow-md flex flex-col gap-4 border border-gray-200">
      <div className="flex flex-row justify-between items-start md:items-center gap-4 w-full">
        {/* Left section: Profile */}
        <div className="
                      flex flex-col items-center gap-2
                      flex-[1_1_15%]
                      w-full sm:w-xs md:w-1/4 lg:w-1/3
                      min-w-[6ch] sm:min-w-[9ch] md:min-w-[12ch]
                      self-center"
                    >

          <div className="w-full max-w-[6rem] aspect-square rounded-full overflow-hidden">
          {friend.profileImage ? 
                <img
                  src={friend.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              : 
                <FaUserCircle className="w-full h-full object-cover"/>
              }
          </div>

          <div className="text-center w-full">
            <p className="text-base sm:text-lg font-bold truncate">@{friend.username}</p>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{friend.location}</p>
          </div>
        </div>

        {/* Middle section: Hike previews */}
        {mergedHikes.length > 0 && (
          /* hidden when screen size is */
          <div className="hidden sm:block flex-[3_1_75%] min-w-0">
            <div className="overflow-x-auto" ref={scrollRef}>
              <div className="flex gap-4">
                <FriendHikePreviewList hikes={mergedHikes} />
              </div>
            </div>
          </div>
        )}

        {/* Right section: Button */}
        <div className="flex items-center justify-end flex-[1_1_10%] min-w-[4rem] self-center">
          <button
            className="generic-button-active text-xs sm:text-sm md:text-base w-full max-w-[5rem]"
            onClick={() => navigate(`/profile/${friend.id}`)}
          >
            View
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendCard;
