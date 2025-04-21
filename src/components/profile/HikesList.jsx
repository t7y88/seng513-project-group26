import React, { useState, useEffect } from "react";
import HikeHistoryCard from "./HikeHistoryCard";
import { getAllHikesAsMap } from "../../firebase/firestore";
import { getMergedRecentHikes } from "../../stubs/helpers/recentHikeMerger";

function HikesList({ completedHikes }) {
  const [activeView, setActiveView] = useState("past");
  const [mergedHikes, setMergedHikes] = useState([]);

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
        {activeView === "past" ? (
          <>
            {mergedHikes.map((merged, index) => (
              <HikeHistoryCard key={index} hike={merged} />
            ))}
            {completedHikes.length === 0 && (
              <p className="text-gray-600">No past hikes recorded yet</p>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">Your saved hikes will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HikesList;
