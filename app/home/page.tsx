"use client";
import Image from "next/image";
import { Film, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SliderSections from "@/components/SliderSections";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  vote_average?: number;
}

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [popularMoviesLoading, setPopularMoviesLoading] = useState(false);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favoritesData = JSON.parse(localStorage.getItem("favorites") || "[]");
    const favoriteIds = favoritesData.map((fav: any) => fav.id);
    setFavorites(favoriteIds);
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

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
        // Take 5 movies for the slider (or all if less than 5)
        const featuredSlides = moviesWithImages.slice(0, 5);
        setFeaturedMovies(featuredSlides);
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

  const toggleFavorite = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();

    let favoritesData = JSON.parse(localStorage.getItem("favorites") || "[]");
    const movie = featuredMovies.find((m) => m.id === movieId);

    if (!movie) return;

    if (isFavorite(movieId)) {
      favoritesData = favoritesData.filter((fav: any) => fav.id !== movieId);
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
      favoritesData.push(movieToAdd);
      toast.success("Added to favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(favoritesData));
    loadFavorites();
  };

  const goToNextSlide = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const goToPrevSlide = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Full-screen banner background that covers the entire page */}
      <div className="fixed inset-0 w-full h-full -z-10">
        {!bannerLoading && featuredMovies.length > 0 ? (
          <Image
            sizes="100vw"
            src={`https://image.tmdb.org/t/p/original${featuredMovies[activeSlideIndex]?.backdrop_path}`}
            alt={featuredMovies[activeSlideIndex]?.title || "Featured Movie"}
            fill
            className="object-cover object-center brightness-[0.85] transition-opacity duration-700 opacity-100"
            priority
            onLoad={() => setBannerLoading(false)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 animate-pulse"></div>
        )}
        {/* Stronger gradient overlay that extends all the way down */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      <div className="relative z-10">
        {/* Navbar with container padding */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>

        {/* Hero section with featured movie slider */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="pt-8 sm:pt-12 pb-16 min-h-[calc(100vh-88px)] flex flex-col justify-center">
            {bannerLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
                {/* Loading state */}
                <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                  <div className="h-12 sm:h-16 bg-gray-800 rounded-md animate-pulse mb-4 w-3/4"></div>
                  <div className="h-20 sm:h-24 bg-gray-800 rounded-md animate-pulse mb-4"></div>
                  <div className="flex flex-wrap gap-4">
                    <div className="h-10 sm:h-12 bg-gray-800 rounded-full animate-pulse w-28 sm:w-32"></div>
                    <div className="h-10 sm:h-12 bg-gray-800 rounded-full animate-pulse w-28 sm:w-32"></div>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
                  <div className="relative w-[200px] xs:w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[2/3] bg-gray-800 rounded-lg animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film size={48} className="text-gray-700" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Swiper
                  modules={[Autoplay, EffectFade, Navigation, Pagination]}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  speed={700}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  navigation={false}
                  loop={true}
                  onSwiper={(swiper) => setSwiperInstance(swiper)}
                  onSlideChange={(swiper) =>
                    setActiveSlideIndex(swiper.realIndex)
                  }
                  className="w-full min-h-[calc(100vh-200px)]"
                >
                  {featuredMovies.map((movie, index) => (
                    <SwiperSlide
                      key={`${movie.id}-${index}`}
                      className="h-full"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center h-full">
                        {/* Movie info column */}
                        <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="h-1 w-10 bg-red-500"></div>
                            <span className="text-gray-300 text-sm uppercase tracking-wider font-medium">
                              Featured Movie
                            </span>
                          </div>

                          {/* Title container with fixed height */}
                          <div className="h-[70px] md:h-[80px] overflow-hidden">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight">
                              {truncateText(movie.title, 40)}
                            </h1>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span className="flex items-center">
                              <Star
                                className="text-yellow-400 mr-2 mb-1"
                                size={16}
                              />
                              {movie.vote_average?.toFixed(1) || "N/A"}
                            </span>
                            <span>•</span>
                            <span>{formatReleaseDate(movie.release_date)}</span>
                          </div>

                          {/* Overview container with fixed height */}
                          <div className="overflow-hidden">
                            <p className="text-base sm:text-lg text-gray-300 max-w-xl">
                              {truncateText(movie.overview, 200)}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <Button
                              size="default"
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full sm:px-6 !py-6 !px-8 sm:py-3 text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-red-700/30"
                              onClick={() =>
                                (window.location.href = `/movie/${movie.id}`)
                              }
                            >
                              More Details
                            </Button>

                            <Button
                              size="default"
                              variant="outline"
                              className="rounded-full sm:px-6 !py-6 !px-8 sm:py-3 text-sm sm:text-base border-gray-700 hover:bg-gray-800 flex items-center gap-2 hover:border-gray-500 transition-all duration-300"
                              onClick={(e) => toggleFavorite(e, movie.id)}
                            >
                              <Image
                                src={
                                  isFavorite(movie.id)
                                    ? "/heart-filled.png"
                                    : "/heart.png"
                                }
                                width={20}
                                height={20}
                                alt="Favorite"
                                className="w-5 h-5"
                              />
                              {isFavorite(movie.id)
                                ? "Remove from Favorites"
                                : "Add to Favorites"}
                            </Button>
                          </div>

                          {/* Custom navigation controls in middle section */}
                          <div className="flex items-center gap-4 mt-6">
                            <button
                              onClick={goToPrevSlide}
                              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                            >
                              <ChevronLeft size={20} />
                            </button>

                            <div className="flex items-center gap-2">
                              {featuredMovies.map((_, idx) => (
                                <div
                                  key={idx}
                                  className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                                    activeSlideIndex === idx
                                      ? "w-8 bg-red-500"
                                      : "w-4 bg-gray-600"
                                  }`}
                                  onClick={() => swiperInstance?.slideTo(idx)}
                                ></div>
                              ))}
                            </div>

                            <button
                              onClick={goToNextSlide}
                              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </div>

                        {/* Movie poster column with enhanced animation */}
                        <div className="flex justify-center sm:justify-end px-4 py-4 order-1 lg:order-2 mb-6 lg:mb-0">
                          <div className="relative w-[200px] xs:w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[2/3] shadow-2xl shadow-black/50 rounded-lg transform rotate-0 hover:rotate-1 hover:scale-[1.03] transition-transform duration-300 cursor-pointer border-2 border-transparent hover:border-gray-300 group">
                            <Image
                              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                              alt={movie.title || "Featured Movie Poster"}
                              sizes="(max-width: 640px) 200px, (max-width: 768px) 280px, (max-width: 1024px) 320px, 350px"
                              fill
                              className="object-cover rounded-lg group-hover:brightness-105 transition-all duration-300"
                              onClick={() =>
                                (window.location.href = `/movie/${movie.id}`)
                              }
                            />

                            <button
                              onClick={(e) => toggleFavorite(e, movie.id)}
                              className="absolute top-3 left-3 bg-gray-800 bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all duration-300 z-10 hover:scale-110"
                            >
                              <Image
                                src={
                                  isFavorite(movie.id)
                                    ? "/heart-filled.png"
                                    : "/heart.png"
                                }
                                width={20}
                                height={20}
                                alt="Favorite"
                                className="w-5 h-5"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Enhanced fade transition */}
                <style jsx global>{`
                  .swiper-slide {
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.7s ease;
                  }
                  .swiper-slide-active {
                    opacity: 1;
                    visibility: visible;
                  }
                  .swiper-fade .swiper-slide {
                    pointer-events: none;
                    transition-property: opacity;
                  }
                  .swiper-fade .swiper-slide-active {
                    pointer-events: auto;
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>

        {/* Movie sliders section with transparent background that allows the main bg to show through */}
        <div className="relative pt-8 pb-16">
          {/* Remove the bg-black/80 class to allow the fixed background to show through */}
          {/* Add a subtle overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40 -z-10"></div>
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
