import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserData } from "../../contexts/userDataContext/useUserData";
import { removeHikeFromWishlist } from "../../firebase/firestoreUser";

export default function WishlistedHikeCard({ hike, isOwnProfile }) {
  const { userData } = useUserData();
  const [confirming, setConfirming] = useState(false);

  const handleRemove = async () => {
    await removeHikeFromWishlist(userData.id, hike.id);
    setConfirming(false);
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      {/* Horizontal layout for larger screens, stacked on small screens */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        
        {/* Thumbnail: Hike image, links to hike details */}
        <Link to={`/hike/${hike.id}`} className="w-full sm:w-1/4">
          <img
            src={hike.image}
            alt={hike.title}
            className="object-cover w-full h-22 rounded-md hover:brightness-95"
          />
        </Link>

        {/* Hike Title, Location, Province */}
        <div className="flex-1 space-y-1">
          <Link to={`/hike/${hike.id}`}>
            <h4 className="text-lg font-medium text-shadow-black hover:underline">
              {hike.title}
            </h4>
          </Link>
          <p className="text-sm text-gray-600">{hike.location}</p>
          <p className="text-xs text-gray-500">{hike.province}</p>
        </div>

        {/* Right section: Remove Button or Confirm/Cancel */}
        {isOwnProfile && (
        <div className="flex flex-col gap-2 justify-center sm:h-[6rem]">
          {!confirming ? (
            <button
              className="generic-button-active text-xs sm:text-sm md:text-base px-4 py-1"
              onClick={() => setConfirming(true)}
            >
              Remove From Wishlist
            </button>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-center text-red-600 font-medium">Are you sure?</p>
              <div className="flex gap-2 justify-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  onClick={handleRemove}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-300 text-black px-3 py-1 rounded text-xs hover:bg-gray-400"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
