import React, { useState } from "react";
import HikeHistoryCard from "./HikeHistoryCard";

function HikesList({ completedHikes }) {
  const [activeView, setActiveView] = useState('past'); // 'past' or 'wishlist'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button
            className={activeView === 'past' ? 'generic-button-active' : 'generic-button-inactive'}
            onClick={() => setActiveView('past')}
          >
            Past Hikes
          </button>
          <button
            className={activeView === 'wishlist' ? 'generic-button-active' : 'generic-button-inactive'}
            onClick={() => setActiveView('wishlist')}
          >
            Wishlist
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {activeView === 'past' ? (
          <div className="space-y-4">
            {completedHikes.map((hike, index) => (
              <HikeHistoryCard key={index} hike={hike} />
            ))}
            {completedHikes.length === 0 && (
              <p className="text-gray-600">No past hikes recorded yet</p>
            )}
          </div>
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