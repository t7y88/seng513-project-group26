import React from 'react';
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

// TODO:
// - Add a link to the hike details page when the card is clicked
// - Add a button to save the hike to the user's profile (if logged in)
// - Change color of difficulty based on level (easy, moderate, hard)

export default function HikeCard() {
  const hikeData = {
    title: "Valley of Five Lakes",
    image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
    location: "Jasper National Park, Alberta",
    difficulty: "Moderate",
    distance: "4.5 km",
    time: "~ 2-3 hours",
    elevation: "66 m"
  };

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-[16/9] w-full">
            <img 
            className="w-full h-full object-cover"
            src={hikeData.image} 
            alt={hikeData.title}
            />
        </div>
        <div className="px-6 py-4">
            <h2 className="font-bold text-xl mb-2 text-gray-800">{hikeData.title}</h2>
            <div className="flex items-center gap-1 mb-2">
                <FaMapMarkerAlt/>
                {/* <i className="fas fa-map-marker-alt mr-2"></i> */}
                <p className="text-gray-600">{hikeData.location}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 items-center justify-center">
            <span className="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800">
                {hikeData.difficulty}
            </span>
            <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-800">
                {hikeData.distance}
            </span>
                <span className="inline-flex items-center bg-purple-100 rounded-full px-3 py-1 text-sm font-semibold text-purple-800">
                    <FaClock className="mr-1" />
                    {hikeData.time}
                </span>
            </div>
        </div>
    </div>
  );
};
