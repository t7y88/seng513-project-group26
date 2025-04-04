import React from "react";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";
import SearchBar from "./SearchBar";

function NavBar() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <nav className="nav-bar">
      <div className="flex items-center justify-between h-16 ">
        <div className="flex items-center mr-2">
          <h1 className="italic text-black-600 text-4xl">
            WildRoutes
          </h1>
        </div>
        <SearchBar/>
        <div className="flex space-x-1 ml-1">
          <Link to="/home" className="nav-link">
            Home
          </Link>
          {/* Only Show the profile option if a user is logged in */}
          {userLoggedIn && (
            <Link to="/profile" className="nav-link">
              Profile
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

            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

