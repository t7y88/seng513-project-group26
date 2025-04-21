import React, { useState, useCallback } from "react";
import { doSignOut } from "../../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import "../../index.css";
import SearchBar from "./SearchBar";

function NavBar() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
  }, []);

  // Handle redirection to the selected hike's page
  const handleHikeClick = (hikeId) => {
    navigate(`/hike/${hikeId}`);
  };

  return (
    <>
      <nav className="hidden md:flex sticky top-0 bg-white z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/home" className="italic text-black-600 text-2xl sm:text-4xl">
                WildRoutes
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <SearchBar onSearchResults={handleSearchResults} />
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-1 ml-1">
              {userLoggedIn && (
                <Link to="/friends" className="nav-link">
                  Friends
                </Link>
              )}
              {userLoggedIn && (
                <Link to="/profile" className="nav-link">
                  My Profile
                </Link>
              )}
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
    </>
  );
}

export default NavBar;
