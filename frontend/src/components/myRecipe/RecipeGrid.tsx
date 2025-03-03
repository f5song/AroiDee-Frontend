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
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  favorites,
  onFavoriteToggle,
}) => {
  if (loading) {
    return (
      <ExploreRecipeGrid
        recipes={[]}
        loading={true}
        favorites={[]}
        onFavoriteToggle={() => {}}
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
          onFavoriteToggle={() => onFavoriteToggle(recipe.id)}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;