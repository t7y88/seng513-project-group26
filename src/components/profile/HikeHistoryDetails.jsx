import React from "react";
import { renderStarRating } from "../../../utils/formatRatingStars";

export default function HikeHistoryDetails({
  image,
  title,
  location,
  dateCompleted,
  timeToComplete,
  rating,
}) {
  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-14 gap-4">

        {/* Hike image */}
        {image && (
          <div className="md:col-span-2">
            <img src={image} alt={title} className="w-full h-full object-cover rounded-md" />
          </div>
        )}

        {/* Title + Location */}
        <div className="md:col-span-6">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{location}</p>
        </div>

        {/* Date */}
        <div className="text-gray-600 md:col-span-2">
          <p>Date: {dateCompleted}</p>
        </div>

        {/* Time to Complete */}
        <div className="text-gray-600 md:col-span-2">
          <p>Completed In: {timeToComplete}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center text-yellow-400 md:col-span-2">
          {renderStarRating(rating).map((star, index) => (
            <span key={index}>{star}</span>
          ))}
          <span className="ml-2 text-gray-600">{rating}</span>
        </div>
      </div>
    </div>
  );
}
