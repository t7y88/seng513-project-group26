import React from 'react';
import { FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from 'react-router-dom';


/**
 * 
 * @param {object} reviewData - The data object containing hike details
 * @param {string} reviewData.userId - The ID of the user who wrote the review
 * @param {string} reviewData.username - The username of the user who wrote the review
 * @param {string} reviewData.hikeId - The ID of the hike being reviewed
 * @param {string} reviewData.title - The title of the hike
 * @param {string} reviewData.image - The image URL of the hike
 * @param {string} reviewData.location - The location of the hike
 * @param {string} reviewData.province - The province of the hike
 * @param {string} reviewData.distance - The distance of the hike
 * @param {string} reviewData.distanceUnit - The unit of distance (e.g., km, miles)
 * @param {string} reviewData.elevation - The elevation gain of the hike
 * @param {string} reviewData.elevationUnit - The unit of elevation (e.g., m, ft)
 * @param {string} reviewData.dateCompleted - The date the hike was completed
 * @param {string} reviewData.rating - The rating given to the hike
 * @param {string} reviewData.notes - The review text for the hike
 * @returns 
 */

export default function LogCard(reviewData) {


  return (
    <div className="p-1.5 rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300 max-sm:w-2xs md:w-sm lg:w-sm shrink-0 h-auto">
        <h2 className="font-bold text-l px-2 text-gray-800 truncate ">
    <Link to={`/profile/${reviewData.userId}`} className='hover:underline transition-all duration-300'> {reviewData.username} </Link> Hiked {reviewData.title}
    </h2>
        <Link className="aspect-[16/9] w-full rounded-2xl" to={`/hike/${reviewData.hikeId}`}>
            <img 
            className="w-full h-full object-cover rounded-2xl"
            src={reviewData.image} 
            alt={reviewData.title}
            />
        </Link>
        {/* info box */}
        <div className="px-2 pt-0.5">
            
            <div className="flex items-center gap-1">
                <FaMapMarkerAlt/>
                {/* <i className="fas fa-map-marker-alt mr-2"></i> */}
                <p className="text-gray-600">{reviewData.location}</p>
                <div className="inline-flex items-center bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    <FaClock className="mr-1" />
                    {reviewData.dateCompleted}
                </div>
            </div>


            <div className="flex flex-wrap gap-2 items-center justify-center">
                <span className="inline-block bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    {reviewData.distance} {reviewData.distanceUnit} <b>Elev.</b> {reviewData.elevation} {reviewData.elevationUnit}
                </span>
                <span className="inline-block bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    {reviewData.rating} / 5
                </span>
                <span className="inline-block bg-grey-300 rounded-full px-2 text-sm font-semibold text-black">
                    {reviewData.notes}
                </span>
            </div>

        </div>
    </div>
  );
};
