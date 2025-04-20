import React, { useState, useEffect } from "react";
import { SlMagnifier } from "react-icons/sl";
import { searchHikes } from "../../firebase/firestore";
import "../../index.css";

/**
 * Search bar component for finding hikes by name
 * @param {Object} props
 * @param {function(HikeEntity[]): void} props.onSearchResults - Callback that receives search results
 * @param {string} [props.placeholder="Find a hike"] - Optional placeholder text
 * @param {string} [props.className=""] - Additional CSS classes for styling
 */
export default function HikeSearchBar({ 
  onSearchResults, 
  placeholder = "Find a hike",
  className = "" 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchHikes(searchTerm);
        onSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        onSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearchResults]);

  return (
    <div className={`relative ${className}`}>
      <form 
        className="search-bar group flex items-center w-full"
        onSubmit={(e) => e.preventDefault()}
      >
        <SlMagnifier className="text-gray-400 w-5 h-5 flex-shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none pl-2 pr-4 text-sm md:text-base w-full placeholder:text-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for hikes"
        />
      </form>
      
      {/* Loading indicator */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
}