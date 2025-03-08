import React from "react";
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
  if (loading) {
    return null;
  }
  if (!loading && recipes.length === 0) {
    return <p className="text-center text-gray-500">🔍 No recipes found!</p>;
  }

  console.log("🔍 Rendering RecipeGrid with recipes:", recipes);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            id: recipe.id,
            title: recipe.title,
            description: recipe.description || "", 
            calories: recipe.calories,
            cook_time: recipe.cook_time ?? 0, 
            image_url: recipe.image_url || "/placeholder.svg", 
            rating: recipe.rating,
            difficulty: recipe.difficulty,

            // ✅ ตรวจสอบ categories: ถ้าเป็น string[] ให้ map เป็น Category[]
            categories: Array.isArray(recipe.categories)
              ? recipe.categories.map((cat) =>
                  typeof cat === "string"
                    ? { id: 0, name: cat, image_url: "" } // ✅ แปลง string เป็น Category object
                    : cat
                )
              : [],
          }}
          isFavorite={favorites.includes(recipe.id)}
          onFavoriteToggle={() => onFavoriteToggle(recipe.id)}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
