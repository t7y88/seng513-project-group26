// Import React (not always required in newer versions, but still common)
import React from "react";

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
        onClick={() => onViewProfile(friend)} // Calls the function passed via props
      >
        View Profile
      </button>
    </div>
  );
}

// Export the component so it can be used in other parts of the app (like FriendsList)
export default FriendCard;
