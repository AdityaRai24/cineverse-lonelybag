"use client";
import Image from "next/image";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import SliderSections from "@/components/SliderSections";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
}

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [popularMoviesLoading, setPopularMoviesLoading] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
  }, []);

  const fetchUpcomingMovies = async () => {
    const url =
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
      },
    };

    try {
      setBannerLoading(true);
      const response = await axios.get(url, options);
      const upcomingMovies = response.data.results;

      // Filter movies with backdrop and poster images
      const moviesWithImages = upcomingMovies.filter(
        (movie: Movie) =>
          movie.backdrop_path && movie.poster_path && movie.overview
      );

      if (moviesWithImages.length > 0) {
        // Select a random movie from the filtered list
        const randomIndex = Math.floor(Math.random() * moviesWithImages.length);
        const selectedMovie = moviesWithImages[randomIndex];
        setFeaturedMovie(selectedMovie);
      }
    } catch (error) {
      console.error("Error fetching upcoming movies:", error);
    } finally {
      setBannerLoading(false);
    }
  };

  const fetchTopRatedMovies = async () => {
    const url =
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
      },
    };

    try {
      setTopRatedLoading(true);
      const response = await axios.get(url, options);
      setTopRatedMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
    } finally {
      setTopRatedLoading(false);
    }
  };

  const fetchPopularMovies = async () => {
    const url =
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
      },
    };

    try {
      setPopularMoviesLoading(true);
      const response = await axios.get(url, options);
      setPopularMovies(response.data.results);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setPopularMoviesLoading(false);
    }
  };

  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Full-screen banner background */}
      <div className="fixed inset-0 -z-10">
        {!bannerLoading && featuredMovie?.backdrop_path ? (
          <Image
            sizes="100vw"
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title || "Featured Movie"}
            fill
            className="object-cover object-center brightness-100 transition-opacity duration-300 opacity-100"
            priority
            onLoad={() => setBannerLoading(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 animate-pulse"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Navbar with container padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>

        {/* Hero section with featured movie */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8 sm:pt-12 pb-16 min-h-[calc(100vh-88px)] flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Movie info column */}
              <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                {bannerLoading ? (
                  <>
                    <div className="h-12 sm:h-16 bg-gray-800 rounded-md animate-pulse mb-4 w-3/4"></div>
                    <div className="h-20 sm:h-24 bg-gray-800 rounded-md animate-pulse mb-4"></div>
                    <div className="flex flex-wrap gap-4">
                      <div className="h-10 sm:h-12 bg-gray-800 rounded-full animate-pulse w-28 sm:w-32"></div>
                      <div className="h-10 sm:h-12 bg-gray-800 rounded-full animate-pulse w-28 sm:w-32"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight">
                      {featuredMovie?.title
                        ? truncateText(featuredMovie.title, 40)
                        : "Loading..."}
                    </h1>

                    <p className="text-base sm:text-lg text-gray-300 max-w-xl">
                      {featuredMovie?.overview
                        ? truncateText(featuredMovie.overview, 200)
                        : "Loading movie description..."}
                    </p>

                    {featuredMovie?.release_date && (
                      <p className="text-sm sm:text-md text-gray-400">
                        Release Date:{" "}
                        {formatReleaseDate(featuredMovie.release_date)}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <Button
                        size="default"
                        className="bg-red-500 hover:bg-red-700 text-white rounded-full sm:px-6 !py-6 !px-8 sm:py-3 text-sm sm:text-base"
                        onClick={() =>
                          (window.location.href = `/movie/${featuredMovie?.id}`)
                        }
                      >
                        More Details
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Movie poster column */}
              <div className="flex justify-center sm:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
                {bannerLoading || !featuredMovie?.poster_path ? (
                  <div className="relative w-[200px] xs:w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[2/3] bg-gray-800 rounded-lg animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film size={48} className="text-gray-700" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-[200px] xs:w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[2/3] shadow-2xl rounded-lg overflow-hidden transform rotate-0 hover:rotate-1 hover:scale-[1.03] transition-transform duration-300 cursor-pointer border-2 border-transparent hover:border-gray-400">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${featuredMovie.poster_path}`}
                      alt={featuredMovie?.title || "Featured Movie Poster"}
                      sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, (max-width: 1024px) 320px, 350px"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Movie sliders section with dark background overlay */}
        <div className="relative bg-black/80 pt-8 pb-16">
            <SliderSections
              isLoading={popularMoviesLoading}
              movies={popularMovies}
              title={"Popular"}
            />
            <SliderSections
              isLoading={topRatedLoading}
              movies={topRatedMovies}
              title={"Top Rated"}
            />
        </div>

        <Footer />
      </div>
    </main>
  );
}