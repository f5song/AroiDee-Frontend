import React from "react";
import { Recipe, Category } from "@/components/common/types";
import RecipeCard from "@/components/common/RecipeCard";
import { useFavorites } from "@/components/auth/FavoritesContext"; // ✅ ใช้ Context

interface RecipeGridProps {
    recipes: Recipe[];
    loading: boolean;
    favorites: number[]; // ✅ เพิ่ม favorites ที่เก็บ ID ของเมนูที่ถูกบันทึก
    isProcessing: Record<number, boolean>; // ✅ ใช้ Record เพื่อเก็บสถานะการโหลดของแต่ละเมนู
    onFavoriteToggle: (id: number) => void;
    isLoggedIn: boolean;
  }
  

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, loading }) => {
  const { favorites, isProcessing, toggleFavorite } = useFavorites(); // ✅ ใช้ฟังก์ชันจาก Context

  if (loading) return null;
  if (!loading && recipes.length === 0)
    return <p className="text-center text-gray-500">🔍 No recipes found!</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            ...recipe,
            description: recipe.description ?? "", // ✅ ป้องกัน undefined
            image_url: recipe.image_url ?? "/placeholder.svg", // ✅ ป้องกันภาพหาย
            cook_time: recipe.cook_time ?? 0, // ✅ ป้องกัน undefined ให้เป็นค่าเริ่มต้น 0
            categories: Array.isArray(recipe.categories)
              ? recipe.categories.map((cat) =>
                  typeof cat === "string"
                    ? { id: 0, name: cat, image_url: "" } // ✅ แปลง string เป็น Category object
                    : (cat as Category)
                )
              : [],
          }}
          isFavorite={favorites.includes(recipe.id)}
          isProcessing={isProcessing[recipe.id] ?? false}
          onFavoriteToggle={() => toggleFavorite(recipe.id)}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
