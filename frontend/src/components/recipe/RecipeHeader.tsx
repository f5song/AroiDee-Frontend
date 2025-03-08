import React from "react";
import { Star, User, Clock, Share2, Bookmark } from "lucide-react";
import { RecipeHeaderProps } from "../../types/recipe"; // นำเข้า Type

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  title,
  author,
  date,
  rating,
  comments,
  image_url,
  saved,
  setSaved,
}) => (
  <div className="relative rounded-xl overflow-hidden">
    <div className="relative h-[500px]">
      <img src={image_url} alt={title} className="w-full h-full object-cover" />
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
            <span className="text-white font-medium">
              {rating} ({comments} รีวิว)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
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
  </div>
);

export default RecipeHeader;
