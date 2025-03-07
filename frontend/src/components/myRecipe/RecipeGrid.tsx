import React from "react";
import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];
  isLoggedIn: boolean;  
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,

  favorites,
  isLoggedIn,
}) => {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favorites.includes(recipe.id)}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
