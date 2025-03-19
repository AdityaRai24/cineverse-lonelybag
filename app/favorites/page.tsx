"use client";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard"; // Import the MovieCard component
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <div
        className="fixed inset-0 bg-cover bg-center z-0 opacity-40"
        style={{
          backgroundImage: `url('/browsebg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-0" />
      <div className="relative z-10 w-full flex-1 flex flex-col">
      <div className="relative z-10 w-[90%] px-4 mx-auto flex-1 flex flex-col mb-16">
          <Navbar />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.length > 0 ? (
              favorites.map((item, index) => (
                <MovieCard key={index} item={item} index={index} />
              ))
            ) : (
              <p className="text-center text-gray-400">No favorites found.</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Favorites;
