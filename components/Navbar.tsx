"use client";

import { Film, Search, X, Heart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Make sure to import axios

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userDetails = localStorage.getItem("user_details");
        if (userDetails) {
          const parsedDetails = JSON.parse(userDetails);
          setUserEmail(parsedDetails.email || "");
        }
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }
  }, []);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node) &&
      isSearchExpanded
    ) {
      setIsSearchExpanded(false);
    }

    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target as Node) &&
      isProfileOpen
    ) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded, isProfileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInputRef.current?.value.trim();
    if (query) {
      router.push(`/browse?search=${encodeURIComponent(query)}`);
      setIsSearchExpanded(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API endpoint to clear the cookie server-side
      await axios.post('/api/logout');
      
      // Clear localStorage
      localStorage.removeItem("user_details");
      
      // Redirect to login page with full page refresh
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback - attempt to clear client-side cookie and redirect
      Cookies.remove("auth_token", { path: "/" });
      window.location.href = "/";
    }
  };

  return (
    <header className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Film className="h-9 w-9 text-red-500 mr-2" />
          <Link href="/home" className="text-4xl font-bold">
            CineVerse
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div ref={searchContainerRef} className="relative flex items-center">
            <div
              className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-black/20 rounded-full border border-gray-700 ${
                isSearchExpanded ? "w-64 pl-4 pr-1" : "w-10 p-1"
              } h-12`}
            >
              {!isSearchExpanded ? (
                <button
                  onClick={toggleSearch}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
              ) : (
                <form
                  onSubmit={handleSearch}
                  className="flex w-full items-center"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search movies..."
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-200 placeholder-gray-500 py-2"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
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

          <Link
            href="/favorites"
            className="p-3 rounded-full bg-black/20 border border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={toggleProfile}
              className="p-3 rounded-full bg-black/20 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900/95 backdrop-blur-sm border border-gray-800 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm text-gray-300 truncate">{userEmail}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;