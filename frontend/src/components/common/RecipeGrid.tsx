import React from "react";
import { Recipe, Category } from "@/lib/recipes/types";
import RecipeCard from "@/components/common/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/components/auth/FavoritesContext";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  favorites?: number[];
  isProcessing?: Record<number, boolean>;
  onFavoriteToggle?: (recipeId: number) => Promise<void>;
  isLoggedIn?: boolean;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  hasFilters = false,
  onClearFilters,
  favorites = [],
  isProcessing = {},
  onFavoriteToggle,
  isLoggedIn = false,
}) => {
  const { isLoadingFavorites } = useFavorites();

  // Show skeleton loader while loading
  if (loading || isLoadingFavorites) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="w-3/4 h-6 mb-2" />
              <Skeleton className="w-full h-4 mb-2" />
              <div className="flex flex-wrap gap-1 mb-2">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-14 h-4" />
              </div>
              <div className="flex justify-between mt-3">
                <Skeleton className="w-16 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state when no recipes are found
  if (!loading && recipes.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <Search className="w-8 h-8 text-orange-500" />
        </div>

        <h3 className="text-xl font-medium mb-2">
          No recipes match your search
        </h3>

        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Try changing your search terms or category to see other results
        </p>

        <div className="flex justify-center">
          <Button
            onClick={onClearFilters}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            View all recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => {
        const toggleHandler = onFavoriteToggle
          ? () => onFavoriteToggle(recipe.id)
          : () => {};

        return (
          <RecipeCard
            key={recipe.id}
            recipe={{
              ...recipe,
              description: recipe.description ?? "",
              image_url: recipe.image_url ?? "/placeholder.svg",
              cook_time: recipe.cook_time ?? 0,
              categories: Array.isArray(recipe.categories)
                ? recipe.categories.map((cat) =>
                    typeof cat === "string"
                      ? { id: 0, name: cat, image_url: "" }
                      : (cat as Category)
                  )
                : [],
            }}
            isFavorite={favorites.includes(recipe.id)}
            isProcessing={isProcessing[recipe.id] ?? false}
            onFavoriteToggle={toggleHandler}
          />
        );
      })}
    </div>
  );
};

export default RecipeGrid;
