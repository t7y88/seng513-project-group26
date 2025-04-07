import React from 'react';
import HikeCard from './HikeCard';

// TODO:
// - Add a link to the hike details page when the card is clicked
// - Add a button to save the hike to the user's profile (if logged in)
// - Change color of difficulty based on level (easy, moderate, hard)

function getHikes(){
  const hikes = [
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
    {
      title: "Valley of Five Lakes",
      image: "https://beckerschalets.com/wp-content/uploads/2020/07/five-lakes-2.jpg",
      location: "Jasper National Park, Alberta",
      difficulty: "Moderate",
      distance: "4.5 km",
      time: "~ 2-3 hours",
      elevation: "66 m"
    },
  ];

  return hikes;
}

export default function SuggestedHikes() {
  return (
    // This color is temporary and will be changed to white like the figma later
    <div className="w-full h-auto bg-blue-400 py-2" >
        <h1 className="px-2 text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>

        <div className="flex flex-nowrap overflow-x-scroll snap-x space-x-4 h-full">
          {getHikes().map((hike, index) => (
            <div key={index} className="snap-center w-sm shrink-0">
              <HikeCard
                title={hike.title}
                image={hike.image}
                location={hike.location}
                difficulty={hike.difficulty}
                distance={hike.distance}
                time={hike.time}
                elevation={hike.elevation}
              />
            </div>
          ))}
        </div>
    </div>
  );
};
