import React from "react";
import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";
import { default as ExploreRecipeGrid } from "@/components/explore/RecipeGrid";

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
    return (
      <ExploreRecipeGrid
        recipes={[]}
        loading={true}
        favorites={[]}
        onFavoriteToggle={() => {}}
        isLoggedIn={isLoggedIn}
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
            recipe={{
              ...recipe, // ✅ คัดลอกค่าทั้งหมดของ recipe
              categories: Array.isArray(recipe.categories)
                ? recipe.categories.map((cat) =>
                    typeof cat === "string"
                      ? { id: 0, name: cat, image_url: "" } // 🔹 ถ้าเป็น string ให้แปลงเป็น Category
                      : cat
                  )
                : [],
            }}
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
