"use client";

import { Film, Search, X, Heart, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState<string>("");

  // Check if we're on the root route
  const isRootRoute = pathname === "/" || pathname === "./";

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      isMobileMenuOpen
    ) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded, isProfileOpen, isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInputRef.current?.value.trim();
    if (query) {
      window.location.href = `/browse?search=${encodeURIComponent(query)}`;
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("user_details");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      Cookies.remove("auth_token", { path: "/" });
      window.location.href = "/";
    }
  };

  return (
    <header className="py-3 px-4 sm:py-4 md:py-6 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center z-20">
          <Film className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 text-red-500 mr-2" />
          <Link
            href="/home"
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold truncate"
          >
            CineVerse
          </Link>
        </div>

        {/* Mobile menu button - visible on small screens but not on root route */}
        {!isRootRoute && (
          <button
            className={`
              ${isMobileMenuOpen ? "hidden" : ""}
              md:hidden p-2 rounded-full bg-black/20 border border-gray-700 text-gray-400 hover:text-white transition-colors z-50`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Desktop navigation - hidden on small screens and on root route */}
        {!isRootRoute && (
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div
              ref={searchContainerRef}
              className="relative flex items-center"
            >
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out bg-black/20 rounded-full border border-gray-700 ${
                  isSearchExpanded
                    ? "w-36 lg:w-48 xl:w-64 pl-3 pr-1"
                    : "w-10 p-1"
                } h-10 lg:h-11`}
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
                      placeholder="Search..."
                      className="bg-transparent border-none outline-none w-full text-sm text-gray-200 placeholder-gray-500 py-1"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex-shrink-0"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={toggleSearch}
                      className="p-1.5 ml-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
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
              className="p-2.5 rounded-full bg-black/20 border border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-500 transition-all"
              aria-label="Favorites"
            >
              <Heart className="h-4 w-4 md:h-5 md:w-5" />
            </Link>

            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfile}
                className="p-2.5 rounded-full bg-black/20 border border-gray-700 text-gray-400 hover:text-white hover:border-white transition-all"
                aria-label="User profile"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900/95 backdrop-blur-sm border border-gray-800 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm text-gray-300 truncate">
                      {userEmail}
                    </p>
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
        )}

        {/* Mobile menu - only visible on small screens when menu is open and not on root route */}
        {!isRootRoute && isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-40 md:hidden flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between p-4 items-center">
              <div className="flex items-center">
                <Film className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-xl font-bold">CineVerse</span>
              </div>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 gap-6 p-6">
              <div className="w-full max-w-xs px-0">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center w-full bg-black/20 rounded-full border border-gray-700 px-4 py-2 h-11"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search movies..."
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-200 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors ml-1"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <Link
                href="/favorites"
                className="flex items-center justify-center w-full max-w-xs py-3 rounded-lg bg-black/20 border border-gray-700 text-gray-300 hover:text-red-500 hover:border-red-500 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-5 w-5 mr-2" />
                <span>Favorites</span>
              </Link>

              <div className="w-full max-w-xs">
                <div className="rounded-lg bg-black/20 border border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm text-gray-300 truncate">
                      {userEmail || "User"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
