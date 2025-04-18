import React, { useState, useEffect, useRef } from 'react';
import HikeCard from './HikeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FriendLog() {


  // const getItemWidth = () => {
  //   const container = scrollContainerRef.current;
  //   if (!container || container.children.length === 0) return 352; // fallback
    
  //   // Get the first card element
  //   const firstCard = container.children[0];
    
  //   // Calculate the full width including margin/spacing
  //   // getBoundingClientRect().width gives the element width
  //   // Adding the right margin (from space-x-8 class, which is 2rem or 32px)
  //   return firstCard.getBoundingClientRect().width + 32;
  // };

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


  // // Fetch initial or next set of hikes. via pagination
  // const fetchHikes = async (nextBatch = false) => {
  //   if (allLoaded) return;
    
  //   setLoading(true);
  //   try {
  //     let hikesQuery;
      
  //     if (nextBatch && lastVisible) {
  //       hikesQuery = query(
  //         collection(db, 'hikes'),
  //         orderBy('title'),
  //         startAfter(lastVisible),
  //         limit(HIKES_PER_PAGE)
  //       );
  //     } else {
  //       hikesQuery = query(
  //         collection(db, 'hikes'),
  //         orderBy('title'),
  //         limit(HIKES_PER_PAGE)
  //       );
  //     }
  //     const querySnapshot = await getDocs(hikesQuery);
  //     if (querySnapshot.empty) {
  //       setAllLoaded(true);
  //       setLoading(false);
  //       return;
  //     }
      
  //     const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  //     setLastVisible(lastDoc);
      
  //     const newHikes = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
      
  //     setHikes(prev => nextBatch ? [...prev, ...newHikes] : newHikes);
  //   } catch (error) {
  //     console.error("Error fetching hikes:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  // dummy function to simulate fetching hikes TODO: Replace with actual api call
  const fetchHikes = async (nextBatch = false) => {
    setLoading(true);
    
    
    if (hikes.length >= 20 && nextBatch) {
      setAllLoaded(true);
      setLoading(false);
      return;
    }
    
    const newHikes = getHikes().slice(0, HIKES_PER_PAGE); 
    
    // Modify each hike to ensure uniqueness between batches
    const batchedHikes = newHikes.map((hike, index) => ({
      ...hike,
      id: `hike-${nextBatch ? hikes.length + index : index}`,
      title: `${hike.title} ${nextBatch ? hikes.length + index : index}`
    }));
    
    setHikes(prev => nextBatch ? [...prev, ...batchedHikes] : batchedHikes);
    setLoading(false);
  };




  return (
    <div className="w-full h-fit py-2 min-md:px-16 relative">
      <h1 className="px-2 text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>

      {/*Show both navigation buttons */}
      <button 
        onClick={scrollPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        aria-label="Previous item"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={scrollNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        aria-label="Next item"
      >
        <ChevronRight size={24} />
      </button>

      <div 
        ref={scrollContainerRef}
        className="flex flex-nowrap overflow-x-auto overscroll-y-none snap-x space-x-8 h-full no-scrollbar"
        onScroll={handleScroll}
      >
        
        {hikes.map((hike, index) => (
          <div key={hike.id || index} className="snap-center">
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
        
        {loading && (
          <div className="snap-center w-sm shrink-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
}