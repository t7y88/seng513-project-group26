import React, { useEffect, useState } from "react";
// For linking to the hikeInfo page if a user selects a completed hike image or title
import { Link } from "react-router-dom";
import { renderStarRating } from "../../../utils/formatRatingStars";
import {
  getHikeTitleByHikeId,
} from "../../firebase/"



function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`;
}


export default function HikeHistoryCard({ hike: hike }) {

  const [hikeTitle, setHikeTitle] = useState("Loading hike details...");
  // For controlling note visibility
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadTitle = async () => {
      const title = await getHikeTitleByHikeId(hike.hikeId);
      setHikeTitle(title || "Untitled Hike");
    };

    loadTitle();
  }, [hike.hikeId]);

  return (
    <div
      className="border-b pb-4 last:border-b-0 last:pb-0 cursor-pointer transition-all duration-200"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="grid grid-cols-1 md:grid-cols-14 gap-4">

        {/* Hike thumbnail */}
        <img
          src={hike.image}
          alt={hike.title}
          className="md:col-span-2 h-[4em] w-full object-cover"
        />

        {/* Title + Location + Date */}
        <div className="md:col-span-6">
          <h4 className="font-medium">{hikeTitle}</h4>
          <p className="text-sm text-gray-600 ">{hike.location}</p>
          <p className="text-sm text-gray-600 md:col-span-3">{hike.dateCompleted}</p>
        </div>

        {/* Time to Complete */}
        <div className="md:col-span-3">
          <p>{formatMinutes(hike.timeToComplete)}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center text-yellow-400 md:col-span-2">
          {renderStarRating(hike.rating).map((star, index) => (
            <span key={index}>{star}</span>
          ))}
          <span className="ml-2 text-gray-600">{hike.rating}</span>
        </div>
      </div>
      {/* Notes (only if expanded and notes exist) */}
      {expanded && hike.notes && (
        <div className="mt-4 px-2 md:px-4 text-gray-700 text-md flex justify-center">
          <p className="text-center max-w-prose">
            <strong>Notes:</strong> {hike.notes}
          </p>
        </div>
      )}

    </div>
  );
}