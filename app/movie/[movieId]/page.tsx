// app/movie/[movieId]/page.tsx
"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Icons
import { ChevronLeft, Clock, Star, Calendar, Users, Tag } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16">
          <div className="w-full h-[500px] bg-gray-800 rounded-2xl animate-pulse mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="w-full h-[450px] bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="h-12 bg-gray-800 rounded-md animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-800 rounded-md animate-pulse mb-6 w-2/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded-md animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8 bg-gray-900 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
          <p className="text-white mb-6">{error}</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-red-600 hover:bg-red-700"
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
      {/* <Navbar /> */}

      {/* Backdrop Image */}
      <div className="relative w-full h-[90vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/80 to-black/20 z-10"></div>
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

      <div className="container mx-auto px-4 -mt-96  relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="rounded-xl overflow-hidden transform rotate-0 hover:scale-[1.03] cursor-pointer hover:rotate-1 transition-transform duration-300 shadow-2xl border-2 border-transparent hover:border-gray-400 h-auto">
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-auto"
                />
              ) : (
                <div className="bg-gray-800 w-full h-[450px] flex items-center justify-center">
                  <p className="text-gray-400">No poster available</p>
                </div>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-xl text-gray-300 italic mb-6">
                {movie.tagline}
              </p>
            )}

            {/* Movie Meta Info */}
            <div className="flex flex-wrap gap-6 mb-8">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={20} />
                  <span>
                    {movie.vote_average.toFixed(1)} (
                    {movie.vote_count.toLocaleString()} votes)
                  </span>
                </div>
              )}

              {movie.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar size={20} className="text-blue-400" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}

              {movie.runtime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-green-400" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Users size={20} className="text-purple-400" />
                <span>{getDirector()}</span>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={20} className="text-pink-400" />
                  <h3 className="text-lg font-semibold">Genres</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.budget > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-400">
                    Budget
                  </h4>
                  <p className="text-white text-lg">
                    {formatCurrency(movie.budget)}
                  </p>
                </div>
              )}

              {movie.revenue > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-400">
                    Revenue
                  </h4>
                  <p className="text-white text-lg">
                    {formatCurrency(movie.revenue)}
                  </p>
                </div>
              )}

              {movie.status && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-400">
                    Status
                  </h4>
                  <p className="text-white text-lg">{movie.status}</p>
                </div>
              )}

              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-400">
                    Languages
                  </h4>
                  <p className="text-white text-lg">
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
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Top Cast</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 6).map((actor) => (
                <div
                  key={actor.id}
                  className="bg-gray-900 cursor-pointer border-2 border-transparent rounded-lg overflow-hidden shadow-lg hover:scale-[1.03] transition-all duration-300 hover:border-gray-600"
                >
                  {actor.profile_path ? (
                    <div className="relative h-60">
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        sizes="300px"
                        className="object-cover object-center"
                      />
                    </div>
                  ) : (
                    <div className="h-60 bg-gray-800 flex items-center justify-center">
                      <p className="text-gray-500 text-center p-2">No image</p>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-white font-medium truncate">
                      {actor.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
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
