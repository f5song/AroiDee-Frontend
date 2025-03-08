import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext"; // ✅ ใช้ useAuth() เพื่อตรวจสอบผู้ใช้
import { Recipe, toggleFavoriteRecipe } from "@/lib/recipes";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";
import axios from "axios";

/**
 * My Recipes page component
 */
export default function MyRecipesPage() {
  const { user } = useAuth(); // ✅ ดึงข้อมูลผู้ใช้จาก Context
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  // ✅ โหลดสูตรอาหารของผู้ใช้จาก backend
  useEffect(() => {
    if (!user) return; // ✅ ป้องกัน error ถ้า user ยังไม่ได้ล็อกอิน

    const fetchUserRecipes = async () => {
      if (!user) return;

      const token = localStorage.getItem("authToken"); // ✅ ใช้ "authToken" แทน "token"
      if (!token || token === "null") {
        console.error("❌ No valid token found. Please log in again.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `https://aroi-dee-backend.vercel.app/api/recipes/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ ใช้ Token ที่ถูกต้อง
            },
          }
        );

        console.log("📢 API Response:", response.data);
        if (!response.data.success) throw new Error(response.data.message);
        setMyRecipes(response.data.data);
      } catch (error) {
        console.error("❌ Error fetching user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [user]); // ✅ ทำงานใหม่เมื่อ user เปลี่ยน

  // ✅ ฟังก์ชันกดบันทึก/ยกเลิกบันทึกสูตรอาหาร
  const handleFavoriteToggle = async (recipeId: number) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.includes(recipeId);
      const success = await toggleFavoriteRecipe(user.id, recipeId); // ✅ ส่ง user.id ไปด้วย

      if (success) {
        setFavorites(
          (prev) =>
            isCurrentlyFavorite
              ? prev.filter((id) => id !== recipeId) // เอาออกจาก Favorites
              : [...prev, recipeId] // เพิ่มเข้า Favorites
        );

        setFavoriteRecipes(
          (prev) =>
            isCurrentlyFavorite
              ? prev.filter((recipe) => recipe.id !== recipeId) // ลบออกจากรายการ
              : [...prev, myRecipes.find((recipe) => recipe.id === recipeId)!] // เพิ่มเข้า
        );
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
          isLoggedIn={!!user} // ส่งค่า isLoggedIn โดยตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
        />
      </div>
    </div>
  );
}
