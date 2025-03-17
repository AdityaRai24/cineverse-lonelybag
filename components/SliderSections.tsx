"use client";
import React, { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const SliderSections = ({ title }: { title: string }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="relative z-20">
      <div className="mx-auto max-w-[90%]">
        {/* Title Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <div className="h-1 w-24 bg-red-600 mt-2"></div>
        </div>

        {/* Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto space-x-8 pb-8 scrollbar-hide snap-x scroll-smooth"
          >
            {[...Array(8)].map((_, index) => (
              <div key={index} className="flex-none w-[280px] snap-start">
                <div className="bg-gray-900 group rounded-lg overflow-hidden transition-transform duration-300 cursor-pointer shadow-lg hover:shadow-red-600/20">
                  {/* Image */}
                  <div className="relative h-[330px]">
                    <Image
                      src="https://image.tmdb.org/t/p/original/a4H5TFw7p7hCzED5zKuNzjBbi5h.jpg"
                      alt="Movie poster"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      {(Math.random() * 2 + 7).toFixed(1)}
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold truncate">
                      Deathstroke: Knights & Dragons
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Action, Adventure
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 hidden md:block">
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 border-none text-white hover:bg-black/80"
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
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="sr-only">Previous</span>
            </Button>
          </div>

          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 hidden md:block">
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 border-none text-white hover:bg-black/80"
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
                className="lucide lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SliderSections;
