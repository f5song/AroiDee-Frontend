import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext"; // ✅ เพิ่ม useAuth
import { 
  Recipe, 
  fetchRecipesBySource, 
  toggleFavoriteRecipe 
} from "@/lib/recipes";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";

/**
 * My Recipes page component
 */
export default function MyRecipesPage() {
  const { user } = useAuth(); // ✅ ดึง user จาก Context
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // ✅ โหลดสูตรอาหารของผู้ใช้และที่บันทึกไว้
  useEffect(() => {
    if (!user) return; // ✅ ป้องกัน error ถ้า user ยังไม่ได้ล็อกอิน

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const userRecipesResponse = await fetchRecipesBySource("USER", user.id);
        const favoritesResponse = await fetchRecipesBySource("FAVORITE", user.id);

        setMyRecipes(userRecipesResponse.recipes);
        setFavoriteRecipes(favoritesResponse.recipes);
        setFavorites(favoritesResponse.recipes.map((r) => r.id));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  // ✅ ฟังก์ชันกดบันทึก/ยกเลิกบันทึกสูตรอาหาร
  const handleFavoriteToggle = async (recipeId: number) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const success = await toggleFavoriteRecipe(user.id, recipeId); // ✅ ต้องส่ง `user.id` ไปด้วย

      if (success) {
        setFavorites((prev) => {
          const isFavorite = prev.includes(recipeId);
          return isFavorite
            ? prev.filter((id) => id !== recipeId)
            : [...prev, recipeId];
        });

        if (favorites.includes(recipeId)) {
          setFavoriteRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
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
  );
}
