// components/myRecipe/RecipeGrid.tsx
import React from "react";
import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";
import { default as ExploreRecipeGrid } from "@/components/explore/RecipeGrid";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number) => void;
  isLoggedIn: boolean; // ✅ เพิ่ม isLoggedIn ที่นี่
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  favorites,
  onFavoriteToggle,
  isLoggedIn, // ✅ รับค่า isLoggedIn
}) => {
  if (loading) {
    return (
      <ExploreRecipeGrid
        recipes={[]}
        loading={true}
        favorites={[]}
        onFavoriteToggle={() => {}}
        isLoggedIn={isLoggedIn} // ✅ ส่ง isLoggedIn ไปให้ ExploreRecipeGrid
      />
    );
  }
  console.log("📢 Recipes in RecipeGrid:", recipes);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.isArray(recipes) ? (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.includes(recipe.id)}
            onFavoriteToggle={() => onFavoriteToggle(recipe.id)}
            isLoggedIn={isLoggedIn}
          />
        ))
      ) : (
        <p className="text-red-500">❌ Error: Recipes is not an array!</p>
      )}
    </div>
  );
};

export default RecipeGrid;
