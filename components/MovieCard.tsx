import { Film } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  fromFavoritesPage?: boolean;
  onFavoriteChange?: (item: any) => void;
}

const MovieCard = ({
  item,
  index,
  isLoading = false,
  fromFavoritesPage = false,
  onFavoriteChange,
}: MovieCardProps) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: any) => fav.id === item.id));
  }, [item.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      favorites = favorites.filter((fav: any) => fav.id !== item.id);
      toast.success("Removed from favorites");

      // If we're on the favorites page, notify the parent component
      if (fromFavoritesPage && onFavoriteChange) {
        onFavoriteChange(item);
      }
    } else {
      favorites.push(item);
      toast.success("Added to favorites");
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="flex-none w-full h-full">
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-800">
          <div className="relative h-56 sm:h-64 md:h-[340px] bg-gray-800 animate-pulse" />
          <div className="p-4 bg-gray-900">
            <div className="h-5 sm:h-6 bg-gray-800 rounded-md animate-pulse mb-2" />
            <div className="h-4 bg-gray-800 rounded-md animate-pulse w-2/3" />
            <div className="h-3 bg-gray-800 rounded-md animate-pulse w-1/4 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex-none w-full sm:w-[200px] md:w-[240px] lg:w-[250px] h-full"
      onClick={() => router.push(`/movie/${item.id}`)}
    >
      <div className="bg-gray-900 group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] border-2 border-transparent hover:border-gray-400 h-full flex flex-col">
        <div className="relative w-full h-56 sm:h-60 md:h-72 lg:h-[380px] flex-shrink-0">
          {item?.poster_path ? (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                alt={item.title || "Movie poster"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500"
                priority={index < 4}
                style={{ objectPosition: "center" }}
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg">
              <div className="flex w-full h-full items-center justify-center">
                <Film size={48} className="text-gray-700" />
              </div>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white text-xs sm:text-sm font-bold rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 z-10">
            {item.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gray-800 bg-opacity-75 p-2 rounded-full shadow-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          {isFavorite ? (
            <Image
              src={"/heart-filled.png"}
              width={16}
              height={16}
              alt="Favorite"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          ) : (
            <Image
              src={"/heart.png"}
              width={16}
              height={16}
              alt="Favorite"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          )}
        </button>

        {/* Movie Details */}
        <div className="p-4 bg-gray-900 z-20 flex-grow">
          <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg truncate transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
            {item.genres?.map((genre: string) => genre).join(", ") ||
              "Action, Adventure"}
          </p>

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
