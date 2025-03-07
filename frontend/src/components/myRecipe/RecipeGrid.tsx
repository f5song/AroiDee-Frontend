import React, { useCallback } from "react";
import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number) => void;
  isLoggedIn: boolean;  
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  favorites,
  onFavoriteToggle,
  isLoggedIn,
}) => {
  // ✅ ป้องกัน onFavoriteToggle เปลี่ยนแปลงตลอดเวลา
  const handleFavorite = useCallback((id: number) => {
    onFavoriteToggle(id);
  }, [onFavoriteToggle]);

  if (loading) {
    return <div>Loading recipes...</div>; // ✅ ไม่โหลด ExploreRecipeGrid เพื่อป้องกัน Loop
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onFavoriteToggle={() => handleFavorite(recipe.id)} // ✅ ใช้ useCallback
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
