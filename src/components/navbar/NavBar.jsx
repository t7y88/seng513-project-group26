import React, { useState, useCallback } from "react";
import { doSignOut } from "../../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useUserData } from "../../contexts/userDataContext";
import "../../index.css";
import SearchBar from "./SearchBar";

/**
 * NavBar component displays a horizontal top navigation bar for larger screens (md and up).
 * It includes a logo, a search bar, and navigation links to different pages.
 * The "Admin" link appears only if the logged-in user has admin privileges.
 */
function NavBar() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const { userData } = useUserData();
  const [searchResults, setSearchResults] = useState([]);

  /**
   * Receives and stores search results from the SearchBar component
   */
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
  }, []);

  /**
   * Redirects to the hike details page for a given hike ID
   * @param {string} hikeId - The ID of the selected hike
   */
  const handleHikeClick = (hikeId) => {
    navigate(`/hike/${hikeId}`);
  };

  return (
    <nav className="hidden md:flex sticky top-0 bg-white z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="italic text-black-600 text-2xl sm:text-4xl">
              WildRoutes
            </Link>
          </div>

          {/* Search Bar (centered) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <SearchBar onSearchResults={handleSearchResults} />
          </div>

          {/* Navigation Links (right-aligned) */}
          <div className="flex space-x-1 ml-1">
            {/* Show "Friends" link if logged in */}
            {userLoggedIn && (
              <Link to="/friends" className="nav-link">
                Friends
              </Link>
            )}

            {/* Show "My Profile" link if logged in */}
            {userLoggedIn && (
              <Link to="/profile" className="nav-link">
                My Profile
              </Link>
            )}

            {/* Conditionally show "Admin" link for admin users */}
            {userLoggedIn && userData?.admin && (
              <Link to="/admin" className="nav-link">
                Admin
              </Link>
            )}

            {/* Show logout link if logged in, otherwise login */}
            {userLoggedIn ? (
              <Link
                to="/login"
                className="nav-link"
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/login");
                  });
                }}
              >
                Logout
              </Link>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
