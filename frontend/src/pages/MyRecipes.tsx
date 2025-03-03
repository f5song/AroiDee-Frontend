// MyRecipesPage.tsx
import React, { useState, useEffect } from "react";
import { 
  Recipe, 
  RecipeSource,
  RECIPES_PER_PAGE, 
  TAB_VALUES,
  fetchRecipesBySource, 
  toggleFavoriteRecipe 
} from "@/lib/recipes";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";

/**
 * My Recipes page component
 */
export default function MyRecipesPage() {
  // State for recipes
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load user's recipes and favorites
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        // Use the updated API
        const userRecipesResponse = await fetchRecipesBySource(RecipeSource.USER);
        const favoritesResponse = await fetchRecipesBySource(RecipeSource.FAVORITE);

        setMyRecipes(userRecipesResponse.recipes);
        setFavoriteRecipes(favoritesResponse.recipes);

        // Get favorite recipe IDs from localStorage
        try {
          const savedFavorites = localStorage.getItem("favoriteRecipes");
          if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
          }
        } catch (error) {
          console.error("Error reading favorites from localStorage:", error);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async (id: number) => {
    try {
      // Use toggleFavoriteRecipe from the updated API
      const result = await toggleFavoriteRecipe(id);
      
      if (result.success) {
        setFavorites((prev) => {
          const isFavorite = prev.includes(id);
          return isFavorite
            ? prev.filter((recipeId) => recipeId !== id)
            : [...prev, id];
        });

        // If we're removing a favorite, update the favorites list
        if (favorites.includes(id)) {
          setFavoriteRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div>
      
      <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <PageHeader />
          
          <RecipeCollection 
            myRecipes={myRecipes}
            favoriteRecipes={favoriteRecipes}
            loading={loading}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </div>
      </div>
    </div>
  );
}