// Import React (not always required in newer versions, but still common)
import React from "react";

import FriendHikePreviewList from "./FriendHikePreviewList";
// Mock data from stubs
import { hikeEntities } from "../../stubs/hikeEntities";
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
*/

function FriendCard({ friend, onViewProfile }) {
  // Merge the user's completedHikes with the full hike data (to get title, image, etc.)
  const mergedHikes = getMergedRecentHikes(friend.completedHikes, hikeEntities);

  return (
    // Card container: white background, padding, rounded corners, shadow
    // Uses flexbox to space out content horizontally with center alignment
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      
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
        // TODO - Need to define the onViewProfile function in the friends component module
        onClick={() => onViewProfile(friend)} // Calls the function passed via props
      >
        View Profile
      </button>

      
      {/* Bottom: Recent Hikes list (now in its own row below the flex) */}
      {friend.completedHikes?.length > 0 && (
        <div>
          <p className="text-sm text-gray-700 font-medium mb-1">Recent Hikes</p>
          <FriendHikePreviewList hikes={mergedHikes} />
        </div>
      )}

    </div>
  );
}

// Export the component so it can be used in other parts of the app (like FriendsList)
export default FriendCard;
