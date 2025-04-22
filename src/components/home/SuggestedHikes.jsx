import React, { useState, useEffect, useRef, useCallback } from "react";
import HikeCard from "./HikeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const HIKES_PER_PAGE = 10;

export default function SuggestedHikes() {
  const [hikes, setHikes] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false); // Define loading state
  const scrollContainerRef = useRef(null);
    
  // Always show both arrows by default
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Flag to track initial scroll has been set
  const [initialScrollSet, setInitialScrollSet] = useState(false);
  
  const fetchHikes = useCallback(async (nextBatch = false) => {
    if (allLoaded) return;

    // setLoading(true); // Set loading to true before fetching
    try {
      
      let hikesQuery;

      if (nextBatch && lastVisible) {
        hikesQuery = query(
          collection(db, "hikes"),
          orderBy("title"),
          startAfter(lastVisible),
          limit(HIKES_PER_PAGE)
        );
      } else {
        hikesQuery = query(
          collection(db, "hikes"),
          orderBy("title"),
          limit(HIKES_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(hikesQuery);
      if (querySnapshot.empty) {
        setAllLoaded(true);
        setLoading(false);
        return;
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);

      const newHikes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHikes((prev) => {
        if (nextBatch) {
          // Create a Set of IDs we already have
          const existingIds = new Set(prev.map(hike => hike.id));
          
          // Only add hikes that aren't already in the array
          const uniqueNewHikes = newHikes.filter(hike => !existingIds.has(hike.id));
          
          return [...prev, ...uniqueNewHikes];
        } else {
          return newHikes;
        }
      });
    } catch (error) {
      console.error("Error fetching hikes:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [allLoaded, lastVisible]);

  useEffect(() => {
    fetchHikes(false);
  }, [fetchHikes]);

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
      
      if (currentScroll >= container.scrollWidth - container.clientWidth - 10) {
        // Always loop back to start
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
        
        // Optionally still fetch more in the background
        if (!allLoaded && !loading) {
          fetchHikes(true);
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
      // I want to eventually change the item width to be more responsive. currently this is
      // just an arbitrary value
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
      <h1 className="px-8 max-sm:px-2 text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>
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
              {/* Scrollable content */}
      <div 
          ref={scrollContainerRef}
          className="flex flex-nowrap overflow-x-auto overscroll-y-none snap-x snap-mandatory space-x-4 h-full no-scrollbar relative scroll-smooth"
          onScroll={handleScroll}
        >
        {/* {loading && <div>Loading...</div>} Show loading indicator */}
        {hikes.map((hike) => (
          <HikeCard key={hike.id} {...hike}/>
        ))}
      </div>
    </div>
  );
}