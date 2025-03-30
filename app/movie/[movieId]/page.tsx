"use client";

import React, { use, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import {
  ChevronLeft,
  Clock,
  Star,
  Calendar,
  Users,
  Tag,
  Film,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path: string }>;
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
  spoken_languages: Array<{ english_name: string }>;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
      department: string;
    }>;
  };
}

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const castScrollRef = useRef<HTMLDivElement>(null);

  const { movieId } = use(params);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
    },
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
      const creditUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;

      try {
        setIsLoading(true);
        const detailsResponse = await axios.get(url, options);
        const detailsData = detailsResponse.data;
        const creditsResponse = await axios.get(creditUrl, options);
        const creditsData = creditsResponse.data;
        setMovie({ ...detailsData, credits: creditsData });
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  // Check if movie is in favorites whenever it changes
  useEffect(() => {
    if (movie) {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.some((fav: any) => fav.id === movie.id));
    }
  }, [movie]);

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get director from crew
  const getDirector = () => {
    if (!movie?.credits?.crew) return "Unknown";
    const director = movie.credits.crew.find(
      (person) => person.job === "Director"
    );
    return director ? director.name : "Unknown";
  };

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!movie) return;

    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      favorites = favorites.filter((fav: any) => fav.id !== movie.id);
      toast.success("Removed from favorites");
    } else {
      // Make sure we have all required fields for the favorites list
      const movieToAdd = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average || 0,
        release_date: movie.release_date,
      };
      favorites.push(movieToAdd);
      toast.success("Added to favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Scroll cast section
  const scrollCast = (direction: "left" | "right") => {
    if (castScrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      castScrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Check if cast is scrollable
  useEffect(() => {
    if (castScrollRef.current) {
      const checkScrollable = () => {
        const { scrollWidth, clientWidth } = castScrollRef.current!;
        setIsScrolling(scrollWidth > clientWidth);
      };

      checkScrollable();
      window.addEventListener("resize", checkScrollable);
      return () => window.removeEventListener("resize", checkScrollable);
    }
  }, [movie]);

  // Improved Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        {/* Skeleton for backdrop */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 z-10"></div>
          <div className="w-full h-full bg-gray-800 animate-pulse"></div>

          {/* Back Button Skeleton */}
          <div className="absolute top-4 left-4 z-20">
            <div className="w-10 h-10 bg-black/50 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-16 -mt-32 sm:-mt-48 md:-mt-64 lg:-mt-96 relative z-20">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Movie Poster Skeleton */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center md:justify-start mb-6 md:mb-0">
              <div className="w-[200px] sm:w-[250px] md:w-full max-w-[350px] aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"></div>
            </div>

            {/* Movie Details Skeleton */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              {/* Title */}
              <div className="h-8 sm:h-10 md:h-12 bg-gray-800 rounded-md animate-pulse mb-4 w-3/4 mx-auto md:mx-0"></div>

              {/* Tagline */}
              <div className="h-5 sm:h-6 bg-gray-800 rounded-md animate-pulse mb-6 w-1/2 mx-auto md:mx-0"></div>

              {/* Meta Info */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-800 rounded-full animate-pulse w-24 sm:w-32"
                  ></div>
                ))}
              </div>

              {/* Genres */}
              <div className="mb-6 flex flex-wrap justify-center md:justify-start gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-800 rounded-full animate-pulse w-16 sm:w-20"
                  ></div>
                ))}
              </div>

              {/* Overview */}
              <div className="mb-6 space-y-2">
                <div className="h-6 bg-gray-800 rounded-md animate-pulse w-1/3 mx-auto md:mx-0"></div>
                <div className="h-4 bg-gray-800 rounded-md animate-pulse w-full"></div>
                <div className="h-4 bg-gray-800 rounded-md animate-pulse w-full"></div>
                <div className="h-4 bg-gray-800 rounded-md animate-pulse w-3/4"></div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 bg-gray-800 rounded-md animate-pulse w-1/3 mx-auto md:mx-0"></div>
                    <div className="h-6 bg-gray-800 rounded-md animate-pulse w-1/2 mx-auto md:mx-0"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cast Section Skeleton */}
          <div className="mt-10 sm:mt-16 mb-8">
            <div className="h-8 bg-gray-800 rounded-md animate-pulse w-1/4 mb-6"></div>
            <div className="flex overflow-x-auto pb-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] bg-gray-900 rounded-lg overflow-hidden"
                >
                  <div className="h-[180px] sm:h-[220px] bg-gray-800 animate-pulse"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-800 rounded-md animate-pulse w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded-md animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center p-6 sm:p-8 bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">
            Oops!
          </h2>
          <p className="text-white mb-6">{error}</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-red-500 hover:bg-red-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop Image */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/30 z-10"></div>
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-80"
          />
        )}

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            onClick={() => router.back()}
            className="bg-black/50 hover:bg-black/70 rounded-full p-2"
          >
            <ChevronLeft className="text-white" size={24} />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-16 -mt-32 sm:-mt-48 md:-mt-64 lg:-mt-96 relative z-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center md:justify-start mb-6 md:mb-0">
            <div className="relative w-[200px] sm:w-[250px] md:w-full max-w-[350px] rounded-xl overflow-hidden transform rotate-0 hover:scale-[1.01] cursor-pointer hover:rotate-[0.5deg] transition-transform duration-300 shadow-2xl border-2 border-transparent hover:border-gray-400 h-auto">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              ) : (
                <div className="relative w-full aspect-[2/3] bg-gray-800 rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film size={64} className="text-gray-700" />
                  </div>
                </div>
              )}

              {/* Add favorite button for the poster */}
              <button
                onClick={toggleFavorite}
                className="absolute top-3 left-3 bg-gray-800 bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-opacity duration-300 z-10"
              >
                <Image
                  src={isFavorite ? "/heart-filled.png" : "/heart.png"}
                  width={20}
                  height={20}
                  alt="Favorite"
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-center md:text-left">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-lg sm:text-xl text-gray-300 italic mb-4 sm:mb-6 text-center md:text-left">
                {movie.tagline}
              </p>
            )}

            {/* Movie Meta Info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={18} />
                  <span className="text-sm sm:text-base">
                    {movie.vote_average.toFixed(1)} (
                    {movie.vote_count.toLocaleString()})
                  </span>
                </div>
              )}

              {movie.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  <span className="text-sm sm:text-base">
                    {formatDate(movie.release_date)}
                  </span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-green-400" />
                  <span className="text-sm sm:text-base">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <span className="text-sm sm:text-base">{getDirector()}</span>
              </div>

              {/* Add favorite button */}
            </div>
            <Button
              onClick={toggleFavorite}
              variant="outline"
              className={` rounded-full py-4 mb-4 text-sm border-gray-700 hover:bg-gray-800 flex items-center gap-2`}
            >
              <Image
                src={isFavorite ? "/heart-filled.png" : "/heart.png"}
                width={20}
                height={20}
                alt="Favorite"
                className={`w-5 h-5`}
              />
              {isFavorite ? "Remove From Favorites" : "Add to Favorites"}
            </Button>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Tag size={18} className="text-pink-400" />
                  <h3 className="text-base sm:text-lg font-semibold">Genres</h3>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 sm:px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-xs sm:text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center md:text-left">
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base text-center md:text-left">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-center md:text-left">
              {movie.budget > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-400">
                    Budget
                  </h4>
                  <p className="text-white text-base sm:text-lg">
                    {formatCurrency(movie.budget)}
                  </p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-400">
                    Revenue
                  </h4>
                  <p className="text-white text-base sm:text-lg">
                    {formatCurrency(movie.revenue)}
                  </p>
                </div>
              )}

              {movie.status && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-400">
                    Status
                  </h4>
                  <p className="text-white text-base sm:text-lg">
                    {movie.status}
                  </p>
                </div>
              )}

              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-400">
                    Languages
                  </h4>
                  <p className="text-white text-base sm:text-lg">
                    {movie.spoken_languages
                      .map((lang) => lang.english_name)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast Section */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mt-10 sm:mt-16 mb-8 relative">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Top Cast
              </h2>

              {isScrolling && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => scrollCast("left")}
                    className="bg-gray-800 hover:bg-gray-700 rounded-full p-1 sm:p-2"
                    size="sm"
                  >
                    <ChevronLeft className="text-white" size={20} />
                  </Button>
                  <Button
                    onClick={() => scrollCast("right")}
                    className="bg-gray-800 hover:bg-gray-700 rounded-full p-1 sm:p-2"
                    size="sm"
                  >
                    <ChevronRight className="text-white" size={20} />
                  </Button>
                </div>
              )}
            </div>

            <div
              ref={castScrollRef}
              className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {movie.credits.cast.slice(0, 12).map((actor) => (
                <div
                  key={actor.id}
                  className="flex-shrink-0 w-[140px] sm:w-[170px] md:w-[200px] bg-gray-900 cursor-pointer border-2 border-transparent rounded-lg overflow-hidden shadow-lg hover:scale-[1.03] transition-all duration-300 hover:border-gray-600"
                >
                  {actor.profile_path ? (
                    <div className="relative h-[180px] sm:h-[220px]">
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        sizes="(max-width: 640px) 140px, (max-width: 768px) 170px, 200px"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="h-[180px] sm:h-[220px] bg-gray-800 flex items-center justify-center">
                      <p className="text-gray-500 text-center p-2 text-sm">
                        No image
                      </p>
                    </div>
                  )}

                  <div className="p-3">
                    <h3 className="text-white font-medium truncate text-sm sm:text-base">
                      {actor.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {actor.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
