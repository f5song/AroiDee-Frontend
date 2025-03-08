import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext"; // ✅ ใช้ useAuth() เพื่อตรวจสอบผู้ใช้
import { Recipe, fetchRecipesBySource } from "@/lib/recipes";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";
import { useFavorites } from "@/components/auth/FavoritesContext"; // ✅ ใช้ Context

export default function MyRecipesPage() {
  const { user } = useAuth();
  const { favorites, toggleFavorite, isProcessing } = useFavorites(); // ✅ ใช้ FavoritesContext
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        // ✅ โหลดสูตรอาหารของฉัน
        const userRecipesResponse = await fetchRecipesBySource("USER", user.id);
        setMyRecipes(userRecipesResponse.recipes);

        // ✅ โหลดสูตรอาหารที่บันทึกไว้
        const favoritesResponse = await fetchRecipesBySource("FAVORITE", user.id);
        setFavoriteRecipes(favoritesResponse.recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user, favorites]); // ✅ ทำงานใหม่เมื่อ user หรือ favorites เปลี่ยน

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <RecipeCollection 
          myRecipes={myRecipes}
          favoriteRecipes={favoriteRecipes}
          loading={loading}
          favorites={favorites}
          onFavoriteToggle={toggleFavorite}
          isProcessing={isProcessing}
          isLoggedIn={!!user}
        />
      </div>
    </div>
  );
}
