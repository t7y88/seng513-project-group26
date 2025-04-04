import React from "react";
import { SlMagnifier } from "react-icons/sl";
import "../index.css";

export default function SearchBar() {
  return (
    <form className="search-bar">
        {/* Magnifying Glass Icon */}
        <SlMagnifier className="text-gray-400 text-2xl mr-1 hidden size[100]:block" />
        {/* Search Input */}
        {/* TODO: Actually Handle searching of hiking pages. */}
        <input
          type="text"
          placeholder="Find a hike"
          className="flex-1 bg-transparent outline-none pl-2 pr-4"
        />
    </form>
  );
}