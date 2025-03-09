import React from "react";
import { Heart, User, Clock, Share2, Star } from "lucide-react";
import { RecipeHeaderProps } from "../../types/recipe";
import { useFavorites } from "../auth/FavoritesContext"; // ✅ ใช้ FavoritesContext
import { useNavigate } from "react-router-dom";

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  title,
  author,
  date,
  rating,
  comments,
  image_url,
  recipeId,
  userId, // ✅ รับ userId เพื่อเช็คว่าเข้าสู่ระบบหรือยัง
}) => {
  const { favorites, isProcessing, toggleFavorite } = useFavorites(); // ✅ ใช้ Context
  const navigate = useNavigate();

  // ✅ ดึง token จาก localStorage โดยอัตโนมัติ
  const token = localStorage.getItem("authToken");

  // ✅ ตรวจสอบว่าสูตรอาหารนี้ถูก save หรือยัง
  const isFavorite = favorites.includes(recipeId);
  const isDisabled = isProcessing[recipeId] ?? false;

  console.log(
    `📌 Recipe ID: ${recipeId}, isFavorite: ${isFavorite}, isProcessing: ${isDisabled}, token: ${token}`
  );

  // ✅ ฟังก์ชัน Toggle Save/Unsave โดยใช้ FavoritesContext
  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!userId || !token) {
      console.warn("❌ ผู้ใช้ไม่ได้ล็อกอินหรือไม่มี token", { userId, token });
      navigate("/login"); // นำไปสู่หน้า Login ถ้าไม่ได้ล็อกอิน
      return;
    }

    if (isDisabled) return; // ป้องกันกดซ้ำ

    console.log(`📌 Toggling favorite for recipe ID: ${recipeId}`);
    await toggleFavorite(recipeId);
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="relative h-[500px]">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover"
        />
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
            {/* ✅ ปุ่ม Save/Unsave ใช้ FavoritesContext */}
            <button
              onClick={handleFavoriteToggle}
              disabled={isDisabled || !token} // ❌ ปิดปุ่มถ้าไม่มี token
              className={`p-3 rounded-full backdrop-blur-md transition-all ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              <span className="ml-2">{isFavorite ? "Saved" : "Save"}</span>
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
