import React from "react";
import { SlMagnifier } from "react-icons/sl";
import "../index.css";

// TODO: Add search functionality to the search bar

export default function SearchBar() {
  return (
    <form className="search-bar group">
      <SlMagnifier className="text-gray-400 w-5 h-5 flex-shrink-0" />
      <input
        type="text"
        placeholder="Find a hike"
        className="flex-1 bg-transparent outline-none pl-2 pr-4 text-sm md:text-base w-full placeholder:text-gray-400"
      />
    </form>
  );
}