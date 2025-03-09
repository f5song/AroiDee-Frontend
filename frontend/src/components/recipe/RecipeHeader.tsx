import React, { useEffect } from "react";
import { Heart, User, Clock, Share2, Star } from "lucide-react";
import { RecipeHeaderProps } from "../../types/recipe";
import { isRecipeSaved, saveRecipe, unsaveRecipe } from "../../lib/api/savedRecipeApi";

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  title,
  author,
  date,
  rating,
  comments,
  image_url,
  recipeId,
  userId,
  saved,
  setSaved,
}) => {
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!userId || !recipeId) return; // ✅ ตรวจสอบว่า userId และ recipeId มีค่าก่อนเรียก API
      try {
        const savedStatus = await isRecipeSaved(userId, recipeId);
        if (typeof setSaved === "function") {
          setSaved(savedStatus);
        }
      } catch (error) {
        console.error("❌ ตรวจสอบการบันทึกล้มเหลว:", error);
      }
    };
    checkSavedStatus();
  }, [recipeId, userId]);

  const toggleSaveRecipe = async () => {
    if (!userId || !recipeId) return; // ✅ ป้องกันการเรียก API ถ้าไม่มีค่า userId หรือ recipeId
    try {
      const success = saved
        ? await unsaveRecipe(userId, recipeId)
        : await saveRecipe(userId, recipeId);
      if (success && typeof setSaved === "function") {
        setSaved(!saved);
      }
    } catch (error) {
      console.error("❌ ไม่สามารถเปลี่ยนสถานะการบันทึกสูตรอาหาร:", error);
    }
  };

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
              onClick={toggleSaveRecipe}
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                saved ? "bg-red-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <Heart size={20} fill={saved ? "currentColor" : "none"} />
              <span className="ml-2">{saved ? "Unsave" : "Save"}</span>
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
