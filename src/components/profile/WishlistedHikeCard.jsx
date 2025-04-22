import React from "react";
import { Link } from "react-router-dom";
import { useUserData } from "../../contexts/userDataContext/useUserData";
import { removeHikeFromWishlist } from "../../firebase/firestoreUser"

export default function WishlistedHikeCard({ hike }) {

  const { user } = useUserData();

  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="flex gap-4 items-center">
        <Link to={`/hike/${hike.id}`} className="w-1/4">
          <img
            src={hike.image}
            alt={hike.title}
            className="object-cover w-full h-24 rounded-md hover:brightness-95"
          />
        </Link>
        {/* Location */}
        <div className="flex-1">
          <Link to={`/hike/${hike.id}`}>
            <h4 className="text-lg font-medium text-blue-600 hover:underline">{hike.title}</h4>
          </Link>
          <p className="text-sm text-gray-600">{hike.location}</p>
          <p className="text-xs text-gray-500">{hike.province}</p>
        </div>
      </div>
      {/* Right section: Button */}
      <div className="flex items-center justify-end flex-[1_1_10%] min-w-[4rem] self-center">
          <button
            className="generic-button-active text-xs sm:text-sm md:text-base w-full max-w-[5rem]"
            onClick={() => removeHikeFromWishlist(user.id, hike.id)}
          >
            Remove From Wishlist
          </button>
        </div>
    </div>
  );
}
