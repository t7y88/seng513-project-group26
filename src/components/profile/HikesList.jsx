import React, { useState, useEffect } from "react";
import HikeHistoryCard from "./HikeHistoryCard";
import WishlistedHikeCard from "./WishlistedHikeCard";
import { getAllHikesAsMap } from "../../firebase/";
import { getMergedRecentHikes } from "../../stubs/helpers/recentHikeMerger";
import { useUserData } from "../../contexts/userDataContext/useUserData";


function HikesList({ completedHikes }) {
  const [activeView, setActiveView] = useState("past");
  const [mergedHikes, setMergedHikes] = useState([]);
  const { hikeWishlist } = useUserData();


  useEffect(() => {
    const loadMergedData = async () => {
      try {
        const hikeEntities = await getAllHikesAsMap(); // returns a map: { [hikeId]: HikeEntity }
        const merged = getMergedRecentHikes(completedHikes, hikeEntities);
        setMergedHikes(merged);
      } catch (error) {
        console.error("Failed to merge hike data:", error);
      }
    };

    if (activeView === "past" && completedHikes.length > 0) {
      loadMergedData();
    }
  }, [completedHikes, activeView]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={activeView === "past" ? "generic-button-active" : "generic-button-inactive"}
            onClick={() => setActiveView("past")}
          >
            Past Hikes
          </button>
          <button
            className={activeView === "wishlist" ? "generic-button-active" : "generic-button-inactive"}
            onClick={() => setActiveView("wishlist")}
          >
            Wishlist
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeView === "wishlist" ? (
          hikeWishlist.length > 0 ? (
            hikeWishlist.map((hike) => (
              <WishlistedHikeCard key={hike.id} hike={hike} />
            ))
          ) : (
            <p className="text-gray-600">You haven't saved any hikes yet.</p>
          )
        ) : (
          <>
            {mergedHikes.map((merged, index) => (
              <HikeHistoryCard key={index} hike={merged} />
            ))}
            {completedHikes.length === 0 && (
              <p className="text-gray-600">No past hikes recorded yet</p>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default HikesList;
