import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext"; // ✅ ใช้ useAuth() เพื่อตรวจสอบผู้ใช้
import { Recipe } from "@/lib/recipes/types";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";
import axios from "axios";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

/**
 * My Recipes page component
 */
export default function MyRecipesPage() {
  const { user } = useAuth(); // ✅ ดึงข้อมูลผู้ใช้จาก Context
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // ✅ โหลดสูตรอาหารของผู้ใช้และ Favorites พร้อมกัน
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No valid token found.");
        return;
      }

      setLoading(true);
      try {
        // ✅ เรียก API ทั้งสูตรของผู้ใช้และ Favorites
        const [userRecipesRes, favoriteRecipesRes] = await Promise.all([
          axios.get(`${API_URL}/recipes/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/saved-recipes/${user.id}/saved-recipes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (userRecipesRes.data.success) {
          setMyRecipes(userRecipesRes.data.data || []);
        } else {
          console.error("❌ Error fetching user recipes:", userRecipesRes.data.message);
        }

        if (favoriteRecipesRes.data.success) {
          setFavorites(favoriteRecipesRes.data.savedRecipeIds || []);
          setFavoriteRecipes(favoriteRecipesRes.data.savedRecipes || []);
        } else {
          console.error("❌ Error fetching saved recipes:", favoriteRecipesRes.data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // ✅ ฟังก์ชันกดบันทึก/ยกเลิกบันทึกสูตรอาหาร
  const handleFavoriteToggle = async (recipeId: number, newState: boolean) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No authentication token found.");
        return;
      }

      const url = newState
        ? `${API_URL}/saved-recipes/save-recipe`
        : `${API_URL}/saved-recipes/unsave-recipe`;

      console.log(`📌 Sending request to recipe ${url} for recipe ${recipeId}`);

      const response = await axios.post(
        url,
        { user_id: user.id, recipe_id: recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFavorites((prev) =>
          newState ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
        );

        setFavoriteRecipes((prev) => {
          if (newState) {
            const newRecipe = myRecipes.find((recipe) => recipe.id === recipeId);
            return newRecipe ? [...prev, newRecipe] : prev;
          } else {
            return prev.filter((recipe) => recipe.id !== recipeId);
          }
        });
      } else {
        console.error("❌ API Error:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error toggling favorite myrecipe:", error);
    }
  };

  console.log("📢 My Recipes:", myRecipes);
  console.log("📢 Favorite Recipes:", favoriteRecipes);
  console.log("📢 Favorite IDs:", favorites);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <RecipeCollection
          myRecipes={myRecipes}
          favoriteRecipes={favoriteRecipes}
          loading={loading}
          favorites={favorites} // ✅ ส่งค่า favorites ไป RecipeCollection
          onFavoriteToggle={handleFavoriteToggle}
          isLoggedIn={!!user}
        />
      </div>
    </div>
  );
}
