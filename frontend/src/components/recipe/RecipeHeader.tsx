import React from "react";
import {
  Star,
  Heart,
  User,
  Clock,
  ChefHat,
  Share2,
  Bookmark,
} from "lucide-react";
import { RecipeHeaderProps } from "../../types/recipe";

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ 
  title, 
  author, 
  date, 
  rating, 
  comments, 
  image_url, 
  liked, 
  saved, 
  setLiked, 
  setSaved 
}) => (
  <div className="relative rounded-xl overflow-hidden">
    <div className="relative h-[500px]">
      <img
        src={image_url}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Recipe Title & Info */}
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
            <span className="text-white font-medium">{rating} ({comments} รีวิว)</span>
          </div>
        </div>
        
        {/* Recipe Meta Info */}
        <div className="grid grid-cols-3 gap-4 max-w-xl">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex flex-col items-center text-white">
            <ChefHat className="mb-1" size={20} />
            <span className="text-xs opacity-80">Cooking Time</span>
            <span className="font-medium">{date.includes("cook") ? date : "6 Mins"}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex space-x-3">
        <button
          onClick={() => setLiked(!liked)}
          className={`p-3 rounded-full backdrop-blur-md transition-all ${
            liked ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <Heart size={20} fill={liked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className={`p-3 rounded-full backdrop-blur-md transition-all ${
            saved ? "bg-yellow-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
          }`}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
        <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  </div>
);

export default RecipeHeader;