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
}

const MovieCard = ({ item, index, isLoading = false }: MovieCardProps) => {
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
          <div className="relative h-[340px] bg-gray-800 animate-pulse" />
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
      className="relative flex-none w-[280px] h-full"
      onClick={() => router.push(`/movie/${item.id}`)}
    >
      <div className="bg-gray-900 group rounded-lg overflow-hidden transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:scale-[1.02] border-2 border-transparent hover:border-gray-400 h-full">
        <div className="relative h-[380px]">
          {item?.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
              alt={item.title || "Movie poster"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500"
              priority={index < 4}
            />
          ) : (
            <div className="w-[350px] rounded-lg h-[340px]">
              <div className="flex w-full h-full items-center justify-center">
                <Film size={72} className="text-gray-700 mr-16" />
              </div>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            {item.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 left-3 bg-gray-800 bg-opacity-75 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {isFavorite ? (
            <Image src={"/heart-filled.png"} width={20} height={20}  alt="Favorite" />
          ) : (
            <Image src={"/heart.png"} width={20} height={20} alt="Favorite" />
          )}
         
        </button>

        {/* Movie Details */}
        <div className="p-4 bg-gray-900 z-20">
          <h3 className="text-white font-semibold text-lg truncate transition-colors duration-300">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm mt-1">
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
