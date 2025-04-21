import React, { useEffect, useState } from "react";
import { renderStarRating } from "../../../utils/formatRatingStars";
import { getHikeTitleByHikeId,
                       } from "../../firebase/firestore"



function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
}


export default function HikeHistoryCard({ hike: completedHike }) {
  const [hikeTitle, setHikeTitle] = useState("Loading...");

  useEffect(() => {
    const loadTitle = async () => {
      const title = await getHikeTitleByHikeId(completedHike.hikeId);
      setHikeTitle(title || "Untitled Hike");
    };

    loadTitle();
  }, [completedHike.hikeId]);

  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-14 gap-4">
        {/* Title + Location */}
        <div className="md:col-span-6">
          <h4 className="font-medium">{hikeTitle}</h4>
          <p className="text-sm text-gray-600">{completedHike.location}</p>
        </div>
  
        {/* Date */}
        <div className="text-gray-600 md:col-span-3">
          <p>Date: {completedHike.dateCompleted}</p>
        </div>
  
        {/* Time to Complete */}
        <div className="text-gray-600 md:col-span-3">
          <p>Completed In: {formatMinutes(completedHike.timeToComplete)}</p>
        </div>
  
        {/* Rating */}
        <div className="flex items-center text-yellow-400 md:col-span-2">
          {renderStarRating(completedHike.rating).map((star, index) => (
            <span key={index}>{star}</span>
          ))}
          <span className="ml-2 text-gray-600">{completedHike.rating}</span>
        </div>
      </div>
    </div>
  );  
}