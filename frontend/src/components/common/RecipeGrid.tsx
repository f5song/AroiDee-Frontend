import React, { useState, useEffect, useCallback } from "react";
import { Recipe, Category } from "@/components/common/types";
import RecipeCard from "@/components/common/RecipeCard";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthContext";

const API_URL = "https://aroi-dee-backend.vercel.app/api/saved-recipes";

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number, newState: boolean) => void;
  isLoggedIn: boolean;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  favorites,
  onFavoriteToggle,
  isLoggedIn,
}) => {
  const { user } = useAuth();
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>(favorites);
  const [isProcessing, setIsProcessing] = useState<Set<number>>(new Set()); // ป้องกันกดซ้ำระหว่างรอ API

  useEffect(() => {
    setFavoriteRecipeIds(favorites);
  }, [favorites]);

  const handleFavoriteToggle = useCallback(
    async (recipeId: number) => {
      if (isProcessing.has(recipeId)) return; // ป้องกันกดซ้ำ
      setIsProcessing((prev) => new Set(prev).add(recipeId));

      const isCurrentlyFavorite = favoriteRecipeIds.includes(recipeId);
      const newState = !isCurrentlyFavorite;

      setFavoriteRecipeIds((prev) =>
        newState ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );

      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No authentication token found.");

        const url = newState ? `${API_URL}/save-recipe` : `${API_URL}/unsave-recipe`;

        console.log("📌 Sending request to:", url);
        console.log("📌 Payload:", { user_id: user?.id, recipe_id: recipeId });

        const response = await axios.post(
          url,
          { user_id: user?.id, recipe_id: recipeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          onFavoriteToggle(recipeId, newState);
        } else {
          console.error("❌ API Error:", response.data.message);
          setFavoriteRecipeIds((prev) =>
            isCurrentlyFavorite ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
          );
        }
      } catch (error) {
        console.error("❌ Error toggling favorite:", error);
        setFavoriteRecipeIds((prev) =>
          isCurrentlyFavorite ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
        );
      } finally {
        setIsProcessing((prev) => {
          const updatedSet = new Set(prev);
          updatedSet.delete(recipeId);
          return updatedSet;
        });
      }
    },
    [favoriteRecipeIds, onFavoriteToggle, isProcessing]
  );

  if (loading) return null;
  if (!loading && recipes.length === 0)
    return <p className="text-center text-gray-500">🔍 No recipes found!</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            ...recipe,
            description: recipe.description ?? "", // ✅ ป้องกัน undefined
            cook_time: recipe.cook_time ?? 0, // ✅ ป้องกัน undefined
            image_url: recipe.image_url ?? "/placeholder.svg", // ✅ ป้องกันภาพหาย
            categories: Array.isArray(recipe.categories)
              ? recipe.categories.map((cat) =>
                  typeof cat === "string"
                    ? { id: 0, name: cat, image_url: "" } // ✅ แปลง string เป็น Category object
                    : (cat as Category)
                )
              : [],
          }}
          isFavorite={favoriteRecipeIds.includes(recipe.id)}
          onFavoriteToggle={() => handleFavoriteToggle(recipe.id)}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
