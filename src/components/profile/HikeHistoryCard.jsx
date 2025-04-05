import React from "react";

export default function HikeHistoryCard({ hike }) {
  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h4 className="font-medium">{hike.name}</h4>
          <p className="text-sm text-gray-600">{hike.location}</p>
        </div>
        <div className="text-gray-600">
          <p>Completed: {hike.dateCompleted}</p>
        </div>
        <div className="text-gray-600">
          <p>Time: {hike.timeCompleted}</p>
        </div>
        <div className="flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1">{hike.rating}</span>
        </div>
      </div>
    </div>
  );
}