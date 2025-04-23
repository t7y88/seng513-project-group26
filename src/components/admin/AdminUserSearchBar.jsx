import React, { useState, useEffect } from "react";
import { SlMagnifier } from "react-icons/sl";
import { searchUsers } from "../../firebase/";
import "../../index.css";

/**
 * @typedef {import("../../types").UserProfile} UserProfile
 */

/**
 * @typedef {Object} AdminUserSearchBarProps
 * @property {(results: UserProfile[]) => void} onSearchResults - Callback that receives an array of user search results.
 * @property {string} [currentUserId] - Optional. Exclude this ID from the search results.
 * @property {string} [placeholder] - Optional input placeholder text.
 * @property {string} [className] - Optional wrapper div classes.
 */

/**
 * AdminUserSearchBar Component
 *
 * Purpose:
 * - Designed for admin use only to search and filter user accounts.
 * - Debounces input and returns user results to a parent-managed state.
 *
 * @param {AdminUserSearchBarProps} props
 */
export default function AdminUserSearchBar({
  onSearchResults,
  currentUserId,
  placeholder = "Search users",
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Show clear button if there's input
  const showClearButton = searchTerm.trim().length > 0;

  /**
   * Clears the current search and result state
   */
  const handleClearSearch = () => {
    setSearchTerm("");
    onSearchResults([]);
  };

  /**
   * Debounced search when the user types
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearchResults([]);
      return;
    }

    setIsSearching(true);
    const delay = setTimeout(async () => {
      try {
        const fetchedResults = await searchUsers(searchTerm);
        const filtered = currentUserId
          ? fetchedResults.filter((u) => u.id !== currentUserId)
          : fetchedResults;
        onSearchResults(filtered);
      } catch (err) {
        console.error("Admin user search failed:", err);
        onSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, currentUserId, onSearchResults]);

  return (
    <div className={`relative w-full ${className}`}>
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
          aria-label="Search for users"
        />
      </form>

      {/* Clear Selection Button */}
      {showClearButton && (
        <div className="mt-2">
          <button
            type="button"
            className="generic-button generic-button-inactive"
            onClick={handleClearSearch}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Loading spinner */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      )}
    </div>
  );
}