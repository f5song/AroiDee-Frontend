import React from "react";
import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number) => void;
  isLoggedIn: boolean; // เพิ่ม isLoggedIn ที่นี่
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  favorites,
  onFavoriteToggle,
  isLoggedIn,  
}) => {
  if (loading) {
    return null; // ✅ ลดการ re-render
  }
  if (!loading && recipes.length === 0) {
    return <p className="text-center text-gray-500">🔍 No recipes found!</p>;
  }
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          onFavoriteToggle={() => onFavoriteToggle(recipe.id)}
          isLoggedIn={isLoggedIn}
        />
      ))}
      
    </div>
  );
  
};


export default RecipeGrid;
