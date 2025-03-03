import { Recipe } from "@/lib/recipes/types";
import RecipeCard from "@/components/explore/RecipeCard";
import { RecipeSkeletons } from "@/components/explore/RecipeCardSkeleton";
import { RECIPES_PER_PAGE } from "@/lib/recipes/constants";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number) => void;
}

/**
 * Grid component for displaying recipes
 */
export function RecipeGrid({ 
  recipes, 
  loading, 
  favorites,
  onFavoriteToggle 
}: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loading ? (
        <RecipeSkeletons count={RECIPES_PER_PAGE} />
      ) : (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.includes(recipe.id)}
            onFavoriteToggle={() => onFavoriteToggle(recipe.id)}
          />
        ))
      )}
    </div>
  );
}

export default RecipeGrid;