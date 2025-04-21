import React, { useRef } from "react";
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

  // Ref to the scroll container
  const scrollRef = useRef(null);

  // Scroll handler for left/right buttons
  const scrollByOffset = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    // Outer container: flex row layout for chevrons and scrollable content
    <div className="flex items-center gap-2 w-full">
      {/* Left chevron button */}
      <button
        onClick={() => scrollByOffset(-150)}
        className="hidden sm:block text-2xl px-2 py-1 rounded hover:bg-gray-100"
        aria-label="Scroll left"
      >
        ←
      </button>


      {/* Container for hike previews: horizontal scroll, spacing between items, padding at the top */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pt-2 no-scrollbar snap-x snap-mandatory max-w-full"
      >
        {/* Render all hikes in scrollable view */}
        {hikes.map((hike, index) => (
          // Each mini hike card
          <div
            key={index}
            onClick={() => navigate(`/hikes/${hike.id}`)}
            className="w-[8em] sm:w-[9em] flex-shrink-0 cursor-pointer snap-start"
          >
            <div className="hike-preview-card">
              {/* Hike image */}
              <img
                src={hike.image}
                alt={hike.title}
                className="h-[4em] w-full object-cover"
              />

              {/* Hike name and date */}
              <div className="p-1 bg-white">
                <p className="truncate overflow-hidden whitespace-nowrap text-sm font-semibold w-full">
                  {hike.title}
                </p>

                <p className="text-xs text-gray-600">
                  {hike.dateCompleted}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Right chevron button */}
      <button
        onClick={() => scrollByOffset(150)}
        className="hidden sm:block text-2xl px-2 py-1 rounded hover:bg-gray-100"
        aria-label="Scroll right"
      >
        →
      </button>

    </div>
  );
}

// Export this component so it can be used inside FriendCard or other components
export default FriendHikePreviewList;
