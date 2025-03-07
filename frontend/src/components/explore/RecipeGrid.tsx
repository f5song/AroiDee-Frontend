import React from "react";
import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";
import { default as ExploreRecipeGrid } from "@/components/explore/RecipeGrid";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];

  isLoggedIn: boolean; // เพิ่ม isLoggedIn ที่นี่
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  favorites,

  isLoggedIn,  // รับค่าของ isLoggedIn จาก props
}) => {
  if (loading) {
    return (
      <ExploreRecipeGrid
        recipes={[]}
        loading={true}
        favorites={[]}

        isLoggedIn={isLoggedIn}  // ส่ง isLoggedIn ไปให้ ExploreRecipeGrid
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          
          isLoggedIn={isLoggedIn}  // ส่ง isLoggedIn ไปให้ RecipeCard
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
