"use client";
import Image from "next/image";
import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import SliderSections from "@/components/SliderSections";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
  }, []);

  const fetchTopRatedMovies = async () => {
    const url =
      "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGVhOWZiYzA1MjBmYTE2YmU5ZDM4YmNhMDU1YThhZCIsIm5iZiI6MTc0MjE0ODUxOC44MDA5OTk5LCJzdWIiOiI2N2Q3MTNhNmQ4MDIzMDk3MDNmMTViY2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.o0flCxvN9s8oBKVGwtl8-OsHBVxrwJ9EQ5LtIpPrbQU",
      },
    };

    try {
      const response = await axios.get(url, options);
      setTopRatedMovies(response.data.results);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchPopularMovies = async () => {
    const url =
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMGVhOWZiYzA1MjBmYTE2YmU5ZDM4YmNhMDU1YThhZCIsIm5iZiI6MTc0MjE0ODUxOC44MDA5OTk5LCJzdWIiOiI2N2Q3MTNhNmQ4MDIzMDk3MDNmMTViY2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.o0flCxvN9s8oBKVGwtl8-OsHBVxrwJ9EQ5LtIpPrbQU",
      },
    };

    try {
      const response = await axios.get(url, options);
      console.log(response.data);
      setPopularMovies(response.data.results);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  console.log(popularMovies);
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 max-h-screen z-0">
        <Image
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src="https://image.tmdb.org/t/p/original/a4H5TFw7p7hCzED5zKuNzjBbi5h.jpg"
          alt="Background"
          fill
          className="object-cover brightness-50"
          priority
        />
        {/* Left gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        {/* Bottom fade to red */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-600/20 to-transparent z-10"></div>
      </div>

      {/* Navbar integrated into main content */}
      <div className="relative z-20 max-w-[80%] container mx-auto px-4">
        <Navbar />

        {/* Hero Content */}
        <div className="pt-12 pb-16 h-[calc(100vh-88px)] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
                Be Happy:
              </h1>

              <p className="text-lg text-gray-300 max-w-xl">
                The assassin Deathstroke tries to save his family from the wrath
                of H.I.V.E. and the murderous Jackal.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8"
                >
                  Watch now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/10 rounded-full px-8"
                >
                  Watch trailer
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[280px] md:w-[350px] aspect-[2/3] shadow-2xl rounded-lg overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="https://image.tmdb.org/t/p/original/a4H5TFw7p7hCzED5zKuNzjBbi5h.jpg"
                  alt="Deathstroke: Knights & Dragons"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SliderSections movies={popularMovies} title={"Popular"} />
        <SliderSections movies={topRatedMovies} title={"Top Rated"} />
      </div>
    </main>
  );
}
