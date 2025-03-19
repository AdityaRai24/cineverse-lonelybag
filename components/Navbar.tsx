"use client";

import { Film, Search, X } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      // Focus the input when expanded
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node) &&
      isSearchExpanded
    ) {
      setIsSearchExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchInputRef.current?.value);
  };

  return (
    <header className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Film className="h-8 w-8 text-primary mr-2" />
          <Link href={'/home'} className="text-2xl font-bold">CineVerse</Link>
        </div>

        <div ref={searchContainerRef} className="relative flex items-center">
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-black/20 rounded-full border border-gray-700 ${
              isSearchExpanded ? "w-64 pl-4 pr-1" : "w-10 p-1"
            }`}
          >
            {!isSearchExpanded ? (
              <button
                onClick={toggleSearch}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
            ) : (
              <form onSubmit={handleSearch} className="flex w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search movies..."
                  className="bg-transparent border-none outline-none w-full text-sm text-gray-200 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="p-2 ml-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
