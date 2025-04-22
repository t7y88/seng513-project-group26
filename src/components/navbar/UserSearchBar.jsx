import React, { useState, useEffect, useRef } from "react";
import { SlMagnifier } from "react-icons/sl";
import { searchUsers } from "../../firebase/";
import { useNavigate } from "react-router-dom";
import "../../index.css";

/**
 * User search bar component for finding users by name or username
 *
 * @param {Object} props
 * @param {function(UserProfile[]): void} props.onSearchResults - Callback that receives search results
 * @param {string} props.currentUserId - Current user's ID (to exclude from results)
 * @param {string} [props.placeholder="Search users"] - Optional placeholder text
 * @param {string} [props.className=""] - Additional CSS classes for styling
 */
export default function UserSearchBar({
  onSearchResults = () => {},
  currentUserId,
  placeholder = "Search users",
  className = "",
}) {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Determine whether to show the clear button
  const showClearButton = searchTerm.trim().length > 0 || results.length > 0;

  // Safe callback to parent
  const safelyCallOnSearchResults = (results) => {
    if (typeof onSearchResults === "function") {
      onSearchResults(results);
    }
  };

  /**
   * Clears the current search state
   */
  const handleClearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setShowDropdown(false);
    safelyCallOnSearchResults([]);
  };

  /**
   * Navigates to user profile on selection
   * @param {UserProfile} user
   */
  const handleResultClick = (user) => {
    setShowDropdown(false);
    setSearchTerm("");
    safelyCallOnSearchResults([]);
    navigate(`/profile/${user.id}`);
  };

  /**
   * Handle search logic with debounce
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setShowDropdown(false);
      safelyCallOnSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const fetchedResults = await searchUsers(searchTerm);
        setResults(fetchedResults);
        setShowDropdown(true);
        safelyCallOnSearchResults(fetchedResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, currentUserId, onSearchResults]);

  /**
   * Hide dropdown when clicking outside the component
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Search Input */}
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

      {/* Clear Selection Button - appears when textfield is non-empty */}
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

      {/* Spinner while searching */}
      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        </div>
      )}

      {/* Dropdown results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white shadow-lg rounded-lg z-50 max-h-64 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleResultClick(user)}
            >
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">
                @{user.username || "unknown"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results found */}
      {showDropdown && !isSearching && results.length === 0 && (
        <div className="absolute w-full mt-2 bg-white shadow-lg rounded-lg z-50 p-4 text-gray-500 text-sm">
          No users found.
        </div>
      )}
    </div>
  );
}
