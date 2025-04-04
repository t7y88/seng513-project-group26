import React from "react";
import { SlMagnifier } from "react-icons/sl";

export default function SearchBar() {
  return (
    <form className="max-w-sm px-4">
      <div className="flex items-center w-full py-1 pl-3 pr-3 text-gray-500 border-2 rounded-2xl bg-gray-50 border-gray-300">
        {/* Magnifying Glass Icon */}
        <SlMagnifier className="text-gray-500 text-xl mr-2" />
        {/* Search Input */}
        {/* TODO: Handle searching of hiking pages. */}
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none pl-2 pr-4"
        />
      </div>
    </form>
  );
}