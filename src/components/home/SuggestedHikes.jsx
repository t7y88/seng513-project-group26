import React, { useState, useEffect, useRef } from 'react';
import HikeCard from './HikeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SuggestedHikes() {
  // Keep your existing state variables
  const [hikes, setHikes] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const scrollContainerRef = useRef(null);
  
  // Always show both arrows by default
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Flag to track initial scroll has been set
  const [initialScrollSet, setInitialScrollSet] = useState(false);
  
  const HIKES_PER_PAGE = 5;

  // Initial data fetch
  useEffect(() => {
    fetchHikes();
  }, []);

  // Scroll to middle after data loads
  useEffect(() => {
    if (hikes.length > 0 && !initialScrollSet) {
      scrollToMiddle();
      setInitialScrollSet(true);
    }
  }, [hikes]);

  // Your existing checkScrollability function can remain for tracking actual scroll position
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // For visual continuity, we never hide the arrows, but we still track real scroll position
    const realCanScrollLeft = container.scrollLeft > 0;
    const realCanScrollRight = 
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
    
    // Optionally, you could disable the arrows visually when they won't do anything
    // by adding an 'opacity-50 cursor-not-allowed' class
    
    // Always keep navigation enabled
    setCanScrollLeft(true);
    setCanScrollRight(true);
  };

  // New function to scroll to the middle of the list on initial load
  const scrollToMiddle = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    // Calculate a position that's about 1-2 items in
    const itemWidth = 352; // Your card width + margin
    const scrollPosition = itemWidth * 1.5; // Scroll about 1.5 items in
    
    // Set the scroll position without animation
    container.scrollLeft = scrollPosition;
    
    // Update scroll indicators
    checkScrollability();
  };
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

  // // Fetch initial or next set of hikes
  // const fetchHikes = async (nextBatch = false) => {
  //   if (allLoaded) return;
    
  //   setLoading(true);
  //   try {
  //     let hikesQuery;
      
  //     if (nextBatch && lastVisible) {
  //       // Fetch next batch starting after the last visible document
  //       hikesQuery = query(
  //         collection(db, 'hikes'),
  //         orderBy('title'), // Adjust this to your preferred sort
  //         startAfter(lastVisible),
  //         limit(HIKES_PER_PAGE)
  //       );
  //     } else {
  //       // Initial fetch
  //       hikesQuery = query(
  //         collection(db, 'hikes'),
  //         orderBy('title'),
  //         limit(HIKES_PER_PAGE)
  //       );
  //     }

  //     const querySnapshot = await getDocs(hikesQuery);
      
  //     // No more documents to load
  //     if (querySnapshot.empty) {
  //       setAllLoaded(true);
  //       setLoading(false);
  //       return;
  //     }
      
  //     // Get the last visible document for pagination
  //     const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
  //     setLastVisible(lastDoc);
      
  //     // Convert the data
  //     const newHikes = querySnapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
      
  //     // Add to existing hikes or set as initial hikes
  //     setHikes(prev => nextBatch ? [...prev, ...newHikes] : newHikes);
  //   } catch (error) {
  //     console.error("Error fetching hikes:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const fetchHikes = async (nextBatch = false) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (hikes.length >= 20 && nextBatch) {
      setAllLoaded(true);
      setLoading(false);
      return;
    }
    
    const newHikes = getHikes().slice(0, HIKES_PER_PAGE); // Use your existing getHikes function
    
    // Modify each hike to ensure uniqueness between batches
    const batchedHikes = newHikes.map((hike, index) => ({
      ...hike,
      id: `hike-${nextBatch ? hikes.length + index : index}`,
      title: `${hike.title} ${nextBatch ? hikes.length + index : index}`
    }));
    
    setHikes(prev => nextBatch ? [...prev, ...batchedHikes] : batchedHikes);
    setLoading(false);
  };

  // Handle scroll to load more when approaching the end
  const handleScroll = () => {
    if (loading || allLoaded) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;
    
    checkScrollability();
    
    // Check if we're near the end of the scroll
    const scrollPosition = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;
    
    // If we've scrolled to 80% of the available content, load more
    if (scrollPosition + containerWidth > scrollWidth * 0.8) {
      fetchHikes(true);
    }
  };

  // Modified scroll functions to handle edge cases
  const scrollNext = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const currentScroll = container.scrollLeft;
    const itemWidth = 352;
    
    // Check if we're at the end
    if (currentScroll >= container.scrollWidth - container.clientWidth - 10) {
      // If we're at the end, either load more or loop back to start
      if (!allLoaded) {
        fetchHikes(true); // Load more data
      } else {
        // Optional: loop back to start
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    } else {
      // Normal scroll to next
      container.scrollTo({
        left: currentScroll + itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollPrevious = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const currentScroll = container.scrollLeft;
    const itemWidth = 352;
    
    // Check if we're at the start
    if (currentScroll <= 0) {
      // Optional: loop to end
      container.scrollTo({
        left: container.scrollWidth - container.clientWidth,
        behavior: 'smooth'
      });
    } else {
      // Normal scroll to previous
      container.scrollTo({
        left: currentScroll - itemWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full h-fit py-2 px-16 relative bg-gray-100">
      <h1 className="px-2 text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>
  
      {/* Navigation buttons remain unchanged */}
      <button 
        onClick={scrollPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        aria-label="Previous item"
      >
        <ChevronLeft size={24} />
      </button>
  
      <button 
        onClick={scrollNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        aria-label="Next item"
      >
        <ChevronRight size={24} />
      </button>
  
      {/* Add a relative wrapper to contain both the scrollable content and the fading edges */}
      <div className="relative">
        {/* Left edge gradient mask */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" 
          style={{
            background: 'linear-gradient(to right, rgb(243, 244, 246), rgba(243, 244, 246, 0))'
          }}
        ></div>
        
        {/* Right edge gradient mask */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" 
          style={{
            background: 'linear-gradient(to left, rgb(243, 244, 246), rgba(243, 244, 246, 0))'
          }}
        ></div>
  
        {/* Scrollable content */}
        <div 
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto overscroll-y-none snap-x space-x-8 h-full no-scrollbar relative"
          onScroll={handleScroll}
        >
          {/* Style for hiding scrollbar */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Add 20px padding to the first and last items to give space for the gradient mask */}
          <div className="w-8 shrink-0"></div>
          
          {hikes.map((hike, index) => (
            <div key={hike.id || index} className="snap-center w-sm shrink-0">
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
          
          {/* Add padding to the end as well */}
          <div className="w-8 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}