"use client";
import React, { useRef } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import MovieCard from "./MovieCard";

const SliderSections = ({
  title,
  movies,
  isLoading = false,
}: {
  title: string;
  movies?: any;
  isLoading?: boolean;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollAmount = 300; // Adjust based on item width

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleViewAll = (title : string) => {
    router.push(`/browse?category=${title}`);
  };



  return (
    <div className="max-w-[90%] mx-auto my-8">
      {/* Title Section */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <Button
          onClick={() => handleViewAll(title)}
          className="bg-red-600 outline-none border  border-transparent hover:border-white text-white hover:bg-transparent hover:text-white"
        >
          View All
        </Button>
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 px-4 py-2 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies?.map((item: any, index: number) => (
            <MovieCard
              isLoading={isLoading}
              key={item.id || index}
              item={item}
              index={index}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            onClick={scrollLeft}
            className="bg-black/50 hover:bg-black/80 rounded-full p-2 text-white"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Button>
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <Button
            onClick={scrollRight}
            className="bg-black/50 hover:bg-black/80 rounded-full p-2 text-white"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SliderSections;
