import React from "react";
import { useNavigate } from "react-router-dom";

import FriendCard from "./FriendCard";
import "../../index.css";


/*
  FriendsList Component

  Props:
    - friends: an array of friend objects.
      Each friend object is expected to include properties like:
        - username (string)
        - location (string)
        - other fields such as age, profileImage, etc. may also be present

  Purpose:
    - This component displays a list of friends.
    - Each friend is rendered inside a styled card with their name and location.
    - A "View Profile" button is included, which navigates to a friend-specific profile page
      and passes along the friend's data using React Router's `state`.

  Usage:
    <FriendsList friends={friendsArray} />
/*
* 'friends' is a prop (a React component property) that is passed to the FriendsList component.
* It is expected to be an array of objects, where each object represents a friend with properties like username, 
* location, etc.
* The component maps over the 'friends' array and displays each friend's information in a styled card format.
*/
function FriendsList({ friends }) {
  // useNavigate is a React Router hook that allows you to navigate programmatically
  const navigate = useNavigate();

  // When a user clicks "View Profile", this function is called
  // It navigates to "/friend-profile" and passes the selected friend object as state
  const handleViewProfile = (friend) => {
    navigate("/friend-profile", { state: { userData: friend } });
  };

  return (
    // Outer container with vertical spacing between each friend card
    <div className="space-y-4">
      {friends.map((friend, index) => (
        // Each friend is displayed in a card layout
        <FriendCard 
          // The key prop is used by React to identify which items have changed, are added, or are removed.
          // It is not a prop that is passed to the component, but a special prop used only by React.
          key = { index } // Unique key for each child in a list (using index here, but ideally use a unique ID)
          friend = { friend } // Pass the friend object to the FriendCard component
          onViewProfile = { handleViewProfile } // Pass the function to handle profile viewing
          />
      ))}
    </div>
  );
}

// Export the component so it can be used elsewhere in the app
export default FriendsList;