import React from 'react';
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";

// TODO:
// - Add a link to the hike details page when the card is clicked
// - Add a button to save the hike to the user's profile (if logged in)

export default function HikeCard(hikeData) {
//   const hikeData = {
//     title: "Valley of Five Lakes",
//     image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
//     location: "Jasper National Park",
//     province: "Alberta"
//     difficulty: "Moderate",
//     distance: "4.5",
//     distanceUnit: "km"
//     time: "250",
//     timeUnit: "min"
//     elevation: "66"
//     elevationUnit: "m"
//   };

  return (
    <div className="p-1.5 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300 shrink-0 max-sm:w-sm max-md:w-1/4 min-md:w-1/3">
        <h2 className="font-bold text-l px-2 text-gray-800">{hikeData.title}, {hikeData.province}</h2>
        <div className="aspect-[16/9] w-full rounded-2xl">
            <img 
            className="w-full h-full object-cover rounded-2xl"
            src={hikeData.image} 
            alt={hikeData.title}
            />
        </div>
        {/* info box */}
        <div className="px-2 pt-0.5">
            
            <div className="flex items-center gap-1">
                <FaMapMarkerAlt/>
                {/* <i className="fas fa-map-marker-alt mr-2"></i> */}
                <p className="text-gray-600">{hikeData.location}</p>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-center">
                <span className="inline-block bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    {hikeData.difficulty}
                </span>
                <span className="inline-block bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    {hikeData.distance} {hikeData.distanceUnit} <b>Elev.</b> {hikeData.elevation} {hikeData.elevationUnit}
                </span>
                <span className="inline-flex items-center bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    <FaClock className="mr-1" />
                    {hikeData.time}
                </span>
            </div>

        </div>
    </div>
  );
};
