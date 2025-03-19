"use client";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { redirect, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  genres?: string[];
}

const Page = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search");
  const categoryValue = searchParams.get("category");
  const formattedCategory = categoryValue?.replace(/\s+/g, "").toLowerCase();

  useEffect(() => {
    if (searchValue && searchValue !== "") {
      fetchSearchMovies(currentPage);
    } else if (formattedCategory === "toprated") {
      fetchTopRatedMovies(currentPage);
    } else if (formattedCategory === "popular") {
      fetchPopularMovies(currentPage);
    } else {
      redirect("/home");
    }
  }, [currentPage, searchParams]);

  const fetchSearchMovies = async (page: number) => {
    setLoading(true);
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=en-US&page=${page}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
      },
    };

    try {
      const response = await axios.get(url, options);
      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  const fetchTopRatedMovies = async (page: number) => {
    const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
      },
    };

    try {
      const response = await axios.get(url, options);
      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top rated movies:", error);
      setLoading(false);
    }
  };

  const fetchPopularMovies = async (page: number) => {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_TMDB_AUTHORIZATION,
      },
    };

    try {
      const response = await axios.get(url, options);
      setMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 500));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    // Always show first page
    pageNumbers.push(1);

    // If current page is far from the first page, add ellipsis
    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        // Skip first and last pages as they're always shown
        pageNumbers.push(i);
      }
    }

    // If current page is far from the last page, add ellipsis
    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const renderSkeletons = () => {
    return Array(10)
      .fill(0)
      .map((_, index) => (
        <MovieCard
          key={`skeleton-${index}`}
          item={{} as Movie}
          index={index}
          isLoading={true}
        />
      ));
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center z-0 opacity-10"
        style={{
          backgroundImage: `url('/browsebg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-20">
        <div className="max-w-[90%] mx-auto">
        <Navbar />

        </div>

        <div className="relative z-20 mb-16 max-w-[90%] container mx-auto px-6">

          <div className="flex items-center justify-between mt-8 mb-8">
            <h2 className="text-4xl font-bold text-white">
              Results For :{" "}
              <span className="text-red-500 underline-offset-8 underline capitalize tracking-wide">
                {formattedCategory ? formattedCategory : searchValue}
              </span>{" "}
            </h2>
            {!loading && (
              <div className="text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 !gap-6"
            style={{ gap: "1.5rem" }} // 6 * 0.25rem
          >
            {loading
              ? renderSkeletons()
              : movies?.map((item, index) => (
                  <MovieCard item={item} index={index} key={item.id} />
                ))}
          </div>

          {!loading && totalPages > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNumber, index) => {
                    if (pageNumber === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="w-10 h-10 flex items-center justify-center text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={`page-${pageNumber}`}
                        onClick={() => handlePageChange(pageNumber as number)}
                        className={`w-10 h-10 flex items-center justify-center rounded-md ${
                          currentPage === pageNumber
                            ? "bg-red-500 text-white"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

const PageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

export default PageWrapper;
