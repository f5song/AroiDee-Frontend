import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useFavorites } from "@/components/auth/FavoritesContext"; // ✅ ใช้ FavoritesContext
import { Recipe } from "@/lib/recipes/types";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";
import axios from "axios";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

/**
 * My Recipes page component
 */
export default function MyRecipesPage() {
  const { user } = useAuth();
  const { favorites, isProcessing, toggleFavorite } = useFavorites(); // ✅ ใช้ Context
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ โหลดสูตรอาหารของผู้ใช้
  useEffect(() => {
    if (!user) return;

    const fetchUserRecipes = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No valid token found.");
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}/recipes/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setMyRecipes(response.data.data || []);
        } else {
          console.error(
            "❌ Error fetching user recipes:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("❌ Error fetching user recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Delicious Pancakes"
          author="John Doe"
          date={new Date().toLocaleDateString()}
          rating={4.5}
          comments={10}
          image_url="/pancakes.jpg"
          recipeId={1}
          userId={2}
          saved={true}
          setSaved={() => {}}
          liked={false}
          setLiked={() => {}}
          token="your-auth-token"
        />

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
