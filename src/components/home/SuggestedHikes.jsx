import React from 'react';
import HikeCard from './HikeCard';

// TODO:
// - Add a link to the hike details page when the card is clicked
// - Add a button to save the hike to the user's profile (if logged in)
// - Change color of difficulty based on level (easy, moderate, hard)

export default function SuggestedHikes() {
  const hikeData1 = {
    title: "Valley of Five Lakes",
    image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
    location: "Jasper National Park, Alberta",
    difficulty: "Moderate",
    distance: "4.5 km",
    time: "~ 2-3 hours",
    elevation: "66 m"
  };

  return (
    // This color is temporary and will be changed to white like the figma later
    <div className="w-full bg-blue-400 px-2 h-1/2" >
        <h1 className="text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>
        <HikeCard {...hikeData1} />
        <HikeCard {...hikeData1} />
        <HikeCard {...hikeData1} />
        <HikeCard {...hikeData1} />
        <HikeCard {...hikeData1} />
    </div>
  );
};
