import React from "react";
import { doSignOut } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import "../index.css";
import SearchBar from "./SearchBar";

function NavBar() {
  // const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return (
    // The nav bar is hidden on mobile devices and only shows on larger screens.
    <nav className="hidden md:flex sticky top-0 bg-white shadow-md z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <div className="flex-shrink-0 ">
            <Link to="/home" className="italic text-black-600 text-2xl sm:text-4xl">
              WildRoutes
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-4 ">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-1 ml-1 ">
            {/* Only Show the profile option if a user is logged in */}
            {userLoggedIn && (
              <Link to="/profile" className="nav-link">
                My Profile
              </Link>
            )}

            {/* Users only have the sign out option if they are logged in. */}
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

