import React, { useState, useEffect } from "react";
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
}) => {
  const { user } = useAuth();
  const [favoriteRecipeIds, setFavoriteRecipeIds] =
    useState<number[]>(favorites);
  const [isProcessing, setIsProcessing] = useState<Set<number>>(new Set());

  useEffect(() => {
    setFavoriteRecipeIds(favorites);
  }, [favorites]);

  const handleFavoriteToggle = async (recipeId: number) => {
    if (isProcessing.has(recipeId)) return; // ✅ ป้องกันกดซ้ำ
    setIsProcessing((prev) => new Set(prev).add(recipeId));

    const isCurrentlyFavorite = favoriteRecipeIds.includes(recipeId);
    const newState = !isCurrentlyFavorite;
    setFavoriteRecipeIds((prev) =>
      newState ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
    );

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found.");

      const url = newState
        ? `${API_URL}/save-recipe`
        : `${API_URL}/unsave-recipe`;

      console.log("📌 Sending request to grid:", url);
      console.log("📌 Payload grid:", { user_id: user?.id, recipe_id: recipeId });

      const response = await axios.post(
        url,
        { user_id: user?.id, recipe_id: recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onFavoriteToggle(recipeId, newState);
      } else {
        console.error("❌ API Error grid:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error toggling favorite grid:", error);
    } finally {
      setIsProcessing((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
    }
  };

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
            description: recipe.description ?? "", // ✅ แก้ปัญหา Type 'string | undefined'
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
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
