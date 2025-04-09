// Import React so we can define and use a component
import React from "react";

// Import the navigate hook from React Router so we can programmatically go to a hike detail page
import { useNavigate } from "react-router-dom";

/*
  FriendHikePreviewList Component

  Props:
    - hikes: an array of recent hike objects completed by a friend.
      Each hike should have:
        - id (string): used for building the hike details route
        - title (string): name of the hike
        - image (string): thumbnail image of the hike
        - dateCompleted (string): date in ISO format (e.g., "2025-04-06")

  Purpose:
    - Displays a compact, scrollable list of the 5 most recent hikes a friend has completed.
    - Each hike is shown with a photo, title, and completion date.
    - Clicking a hike card navigates to that hike’s detailed page.
*/

function FriendHikePreviewList({ hikes }) {
  // useNavigate hook lets us change pages when a user clicks something
  const navigate = useNavigate();

  return (
    // Container for hike previews: horizontal scroll, spacing between items, padding at the top
    <div className="flex gap-2 overflow-x-auto pt-2">
      {/* Only show the first 5 hikes using slice */}
      {hikes.slice(0, 5).map((hike, index) => (
        // Each mini hike card
        <div
          key={index} // React needs a unique key for list rendering
          onClick={() => navigate(`/hikes/${hike.id}`)} // Clicking the card navigates to the hike details page
          className="w-24 min-w-[96px] cursor-pointer rounded overflow-hidden shadow hover:shadow-lg transition"
        >
          {/* Hike image */}
          <img
            src={hike.image} // Image URL
            alt={hike.title} // Alt text for accessibility
            className="h-16 w-full object-cover" // Image fits container, cropped if needed
          />

          {/* Hike name and date */}
          <div className="p-1 bg-white">
            {/* Hike title — truncated so long names don't overflow */}
            <p className="text-xs font-semibold truncate">{hike.title}</p>

            {/* Completion date formatted as MM/DD/YYYY */}
            <p className="text-[10px] text-gray-500">
              {new Date(hike.dateCompleted).toLocaleDateString("en-US")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Export this component so it can be used inside FriendCard or other components
export default FriendHikePreviewList;
