import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface MovieCardProps {
  item: {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
    genres?: string[];
  };
  index: number;
  isLoading?: boolean;
}

const MovieCard = ({ item, index, isLoading = false }: MovieCardProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex-none w-full h-full">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-800">
          {/* Skeleton Image */}
          <div className="relative h-[340px] bg-gray-800 animate-pulse" />

          {/* Skeleton Details */}
          <div className="p-4 bg-gray-900">
            <div className="h-6 bg-gray-800 rounded-md animate-pulse mb-2" />
            <div className="h-4 bg-gray-800 rounded-md animate-pulse w-2/3" />
            <div className="h-3 bg-gray-800 rounded-md animate-pulse w-1/4 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-none w-[280px] h-full"
      onClick={() => router.push(`/movie/${item.id}`)}
    >
      <div className="bg-gray-900 group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] border border-gray-800 hover:border-gray-500 h-full">
        {/* Image */}
        <div className="relative h-[340px]">
          <Image
            src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
            alt={item.title || "Movie poster"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500"
            priority={index < 4}
          />

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-red-600 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            {item.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        {/* Movie Details */}
        <div className="p-4 bg-gray-900 z-20">
          <h3 className="text-white font-semibold text-lg truncate transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            {item.genres?.map((genre: string) => genre).join(", ") ||
              "Action, Adventure"}
          </p>

          {/* Release Year (if available) */}
          {item.release_date && (
            <p className="text-gray-500 text-xs mt-2">
              {new Date(item.release_date).getFullYear()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
