import React, { useState, useEffect, useRef, useCallback } from "react";
import HikeCard from "./HikeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {seedFirestore } from  "../../firebase/firebase/seedFirestore.js";

const HIKES_PER_PAGE = 5;

export default function SuggestedHikes() {
  seedFirestore();
  const [hikes, setHikes] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false); // Define loading state
  const scrollContainerRef = useRef(null);
  
  const fetchHikes = useCallback(async (nextBatch = false) => {
    if (allLoaded) return;

    setLoading(true); // Set loading to true before fetching
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

      setHikes((prev) => (nextBatch ? [...prev, ...newHikes] : newHikes));
    } catch (error) {
      console.error("Error fetching hikes:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [allLoaded, lastVisible]);

  useEffect(() => {
    fetchHikes(false);
  }, [fetchHikes]);

  return (
    <div className="w-full h-fit py-2 relative bg-gray-red-100">
      <h1 className="px-16 text-2xl font-stretch-ultra-expanded text-left">Suggested Hikes</h1>
      <div ref={scrollContainerRef} className="flex overflow-x-auto">
        {loading && <div>Loading...</div>} {/* Show loading indicator */}
        {hikes.map((hike) => (
          <HikeCard key={hike.id} {...hike} />
        ))}
      </div>
    </div>
  );
}