import  { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Recipe } from "@/lib/recipes/types";
import RecipeCollection from "@/components/myRecipe/RecipeCollection";
import PageHeader from "@/components/myRecipe/PageHeader";
import axios from "axios";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const [userRecipesRes, favoriteRecipesRes] = await Promise.all([
          axios.get(`${API_URL}/recipes/user/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/saved-recipes/${user.id}/saved-recipes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMyRecipes(userRecipesRes.data.data || []);
        setFavoriteRecipes(favoriteRecipesRes.data.savedRecipes || []);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        <RecipeCollection myRecipes={myRecipes} favoriteRecipes={favoriteRecipes} loading={loading} />
      </div>
    </div>
  );
}
