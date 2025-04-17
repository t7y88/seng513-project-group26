import React, { useState, useEffect, useRef } from 'react';
import HikeCard from './HikeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SuggestedHikes() {
  const [hikes, setHikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const scrollContainerRef = useRef(null);
    
  // Flag to track initial scroll has been set
  const [initialScrollSet, setInitialScrollSet] = useState(false);
  
  const HIKES_PER_PAGE = 5;



  const checkScrollability = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

  }, []);

  // Function to scroll to the middle of the list on initial load
  const scrollToMiddle = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
  
    // Calculate a position that's about 1-2 items in
    const itemWidth = 352; // Your card width + margin
    const scrollPosition = itemWidth * 1.5; // Scroll about 1.5 items in
  
    // Set the scroll position without animation
    container.scrollLeft = scrollPosition;
  
    // Update scroll indicators
    checkScrollability();
  }, [checkScrollability]);
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



  const fetchHikes = React.useCallback(async (nextBatch = false) => {
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
  }, [hikes.length, HIKES_PER_PAGE]);

    // Initial data fetch
    useEffect(() => {
      fetchHikes();
    }, [fetchHikes]);
  
    useEffect(() => {
      if (hikes.length > 0 && !initialScrollSet) {
        scrollToMiddle();
        setInitialScrollSet(true);
      }
    }, [hikes, initialScrollSet, scrollToMiddle]);


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
    <div className="w-full h-fit py-2 relative bg-gray-red-100">
      <h1 className="px-16 text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>

      <button 
        onClick={scrollPrevious}
        className="absolute float-left left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        aria-label="Previous item"
      >
        <ChevronLeft size={24} />
      </button>
  
      <button 
        onClick={scrollNext}
        className="absolute float-right right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        aria-label="Next item"
      >
        <ChevronRight size={24} />
      </button>
  
      <div className="w-full mask-l-from-80% mask-r-from-80% sm:mask-l-from-80% sm:mask-r-from-80% lg:mask-l-from-80% lg:mask-r-from-80%">

  
        {/* Scrollable content */}
        <div 
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto overscroll-y-none snap-x space-x-8 h-full no-scrollbar relative w-full"
          onScroll={handleScroll}
        >

          

          <div className="shrink-0"></div>
          
          {hikes.map((hike, index) => (
            <div key={hike.id || index} className="snap-center max-sm:w-xs min-sm:w-sm shrink-0">
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
          

          <div className="w-8 shrink-0"></div>
        </div>
      </div>
    </div>
  );
}