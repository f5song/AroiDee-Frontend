import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext"; // ✅ ใช้ FavoritesContext
import { Recipe } from "@/lib/recipes/types";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";
/**
 * My Recipes page component
 */
export default function MyRecipesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { favorites, isProcessing, toggleFavorite } = useFavorites(); // ✅ ใช้ Context
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ ตรวจสอบ authToken และ redirect ถ้าไม่มี
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login"); // ✅ เปลี่ยนเส้นทางไปหน้า Login ถ้าไม่มี token
      return;
    }

    // ✅ ตรวจสอบว่ามี user ก่อนโหลดข้อมูล
    if (!user) return;

    const fetchUserRecipes = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}/recipes/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setMyRecipes(response.data.data || []);
        } else {
          console.error("❌ Error fetching user recipes:", response.data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [user, navigate]); // ✅ ใช้ navigate แทน router

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <RecipeCollection
          myRecipes={myRecipes}
          favoriteRecipes={myRecipes.filter((r) => favorites.includes(r.id))} // ✅ ใช้ FavoritesContext
          loading={loading}
          favorites={favorites} // ✅ ส่ง favorites จาก Context
          isProcessing={isProcessing} // ✅ ส่ง isProcessing จาก Context
          onFavoriteToggle={toggleFavorite} // ✅ ใช้ toggleFavorite จาก Context
          isLoggedIn={!!user}
        />
      </div>
    </div>
  );
}
