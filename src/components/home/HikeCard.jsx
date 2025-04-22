import React from 'react';
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from 'react-router-dom';
// TODO:
// - Add a link to the hike details page when the card is clicked
const formatTimeToHours = (timeInMinutes) => {
    if (!timeInMinutes) return '';
    
    // Convert to number if it's a string
    const minutes = Number(timeInMinutes);
    
    if (isNaN(minutes)) return timeInMinutes; // Return original if not a valid number
    
    // Convert minutes to hours with half-hour precision
    const hours = minutes / 60;
    const roundedHours = Math.round(hours * 2) / 2; // Round to nearest 0.5
    
    // Format the output
    if (roundedHours === 1) return '1 hr';
    if (roundedHours % 1 === 0) return `${roundedHours} hrs`;
    
    // For half hours, format as "X.5 hrs"
    const wholeHours = Math.floor(roundedHours);
    return wholeHours === 0 ? '0.5 hrs' : `${wholeHours}.5 hrs`;
  };
  

/**
 * 
 * @param {object} hikeData - The data object containing hike details
 * @param {string} hikeData.hikeId - The unique ID of the hike
 * @param {string} hikeData.title - The title of the hike
 * @param {string} hikeData.image - The image URL of the hike
 * @param {string} hikeData.location - The location of the hike
 * @param {string} hikeData.province - The province of the hike
 * @param {string} hikeData.difficulty - The difficulty level of the hike
 * @param {string} hikeData.distance - The distance of the hike
 * @param {string} hikeData.distanceUnit - The unit of distance (e.g., km, miles)
 * @param {string} hikeData.time - The estimated time to complete the hike
 * @param {string} hikeData.elevation - The elevation gain of the hike
 * @param {string} hikeData.elevationUnit - The unit of elevation (e.g., m, ft)
 * @returns 
 */
export default function HikeCard(hikeData) {

  return (
    <Link 
      to={`/hike/${hikeData.hikeId}`}
       className="p-1.5 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300 shrink-0 max-sm:w-xs max-md:w-1/4 min-md:w-1/3 snap-center scroll-smooth cursor-pointer">
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
                    {formatTimeToHours(hikeData.time)}
                </span>
            </div>

        </div>
    </Link>
  );
};
