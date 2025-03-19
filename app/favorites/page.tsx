"use client";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
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

  // Function to update favorites when removed
  const handleFavoriteChange = (updatedItem: any) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav: any) => fav.id !== updatedItem.id)
    );
  };

  return (
    <div>
      <div className="contianer mx-auto max-w-[90%]">
        <Navbar />
        <main className="min-h-screen bg-gray-950 py-8 px-4">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-white mb-6">
              Your Favorites
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favorites.length > 0 ? (
                favorites.map((item, index) => (
                  <MovieCard
                    key={index}
                    item={item}
                    index={index}
                    onFavoriteChange={handleFavoriteChange}
                    fromFavoritesPage
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-xl text-gray-400 py-12">
                  No favorites found.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
