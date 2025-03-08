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
  onFavoriteToggle: (id: number) => void;
  isLoggedIn: boolean;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  onFavoriteToggle,
  isLoggedIn,
}) => {
  const { user } = useAuth();
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);

  // ✅ โหลดค่า favorite จาก backend
  useEffect(() => {
    if (!user?.id) return;

    const fetchFavoriteRecipes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("❌ No authentication token found.");
          return;
        }

        const response = await axios.get(`${API_URL}/${user.id}/saved-recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setFavoriteRecipeIds(response.data.savedRecipes.map((r: any) => r.recipe_id));
        } else {
          console.error("❌ Failed to fetch saved recipes:", response.data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching saved recipes:", error);
      }
    };

    fetchFavoriteRecipes();
  }, [user]);

  if (loading) {
    return null;
  }
  if (!loading && recipes.length === 0) {
    return <p className="text-center text-gray-500">🔍 No recipes found!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={{
            ...recipe,
            description: recipe.description ?? "", // ✅ ป้องกัน undefined
            cook_time: recipe.cook_time ?? 0, // ✅ ป้องกัน undefined
            categories: Array.isArray(recipe.categories)
              ? recipe.categories.map((cat) =>
                  typeof cat === "string"
                    ? { id: 0, name: cat, image_url: "" } // ✅ แปลง string เป็น Category object
                    : (cat as Category)
                )
              : [],
          }}
          isFavorite={favoriteRecipeIds.includes(recipe.id)}
          onFavoriteToggle={() => {
            setFavoriteRecipeIds((prev) =>
              prev.includes(recipe.id)
                ? prev.filter((id) => id !== recipe.id)
                : [...prev, recipe.id]
            );
            onFavoriteToggle(recipe.id);
          }}
          isLoggedIn={isLoggedIn}
        />
      ))}
    </div>
  );
};

export default RecipeGrid;
