import React from "react";
import { Heart, User, Clock, Share2, Star } from "lucide-react";
import { RecipeHeaderProps } from "../../types/recipe";
import { useFavorites } from "../auth/FavoritesContext";
import { useNavigate } from "react-router-dom";

// เพิ่ม prop สำหรับ Skeleton
interface RecipeHeaderSkeletonProps extends Partial<RecipeHeaderProps> {
  isLoading?: boolean;
}

const RecipeHeader: React.FC<RecipeHeaderSkeletonProps> = ({
  title,
  author,
  date,
  rating,
  comments,
  image_url,
  recipeId,
  userId,
  isLoading = false,
}) => {
  const { favorites, isProcessing, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const isFavorite = favorites.includes(recipeId || -1);
  const isDisabled = isProcessing[recipeId || -1] ?? false;

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!userId || !token) {
      navigate("/login");
      return;
    }

    if (isDisabled) return;

    await toggleFavorite(recipeId!);
  };

  // 🔧 Skeleton UI
  if (isLoading) {
    return (
      <div className="relative h-[500px] bg-gray-300 dark:bg-gray-700 animate-pulse rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="h-12 w-2/3 bg-gray-400 dark:bg-gray-600 rounded mb-4" />
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="h-8 w-32 bg-gray-400 dark:bg-gray-600 rounded-full" />
            <div className="h-8 w-32 bg-gray-400 dark:bg-gray-600 rounded-full" />
            <div className="h-8 w-40 bg-gray-400 dark:bg-gray-600 rounded-full" />
          </div>
          <div className="absolute top-6 right-6 flex space-x-3">
            <div className="h-10 w-24 bg-gray-400 dark:bg-gray-600 rounded-full" />
            <div className="h-10 w-10 bg-gray-400 dark:bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="relative h-[500px]">
        <img src={image_url} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <h1 className="text-5xl font-bold mb-3 text-white">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <User className="mr-2 text-white" size={16} />
              <span className="text-white">{author}</span>
            </div>
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <Clock className="mr-2 text-white" size={16} />
              <span className="text-white">{date}</span>
            </div>
            <div className="flex items-center bg-orange-500/90 px-4 py-2 rounded-full">
              <Star className="mr-2 text-white" size={16} fill="white" />
              <span className="text-white font-medium">
                {rating} ({comments} reviews)
              </span>
            </div>
          </div>
          <div className="absolute top-6 right-6 flex space-x-3">
            <button
              onClick={handleFavoriteToggle}
              disabled={isDisabled || !token}
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;
