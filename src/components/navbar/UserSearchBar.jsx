import React, { useState, useEffect } from "react";
import { SlMagnifier } from "react-icons/sl";
import { searchUsers } from "../../firebase/firestore";
import "../../index.css";

/**
 * Search bar component for finding friends by name or username
 * @param {Object} props
 * @param {function(UserProfile[]): void} props.onSearchResults - Callback that receives search results
 * @param {string} props.currentUserId - ID of current user to exclude from results
 * @param {string} [props.placeholder="Find friends"] - Optional placeholder text
 * @param {string} [props.className=""] - Additional CSS classes for styling
 */
export default function UserSearchBar({ 
  onSearchResults, 
  currentUserId,
  placeholder = "Find friends by name or username",
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
        const results = await searchUsers(searchTerm, currentUserId);
        onSearchResults(results);
      } catch (error) {
        console.error("Friend search error:", error);
        onSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, currentUserId, onSearchResults]);

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
          aria-label="Search for friends"
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