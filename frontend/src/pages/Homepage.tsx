import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthContext";
import Hero from "@/components/main/Hero";
import Categories from "@/components/main/Categories";
import Content from "@/components/main/Content";
import ShareRecipe from "@/components/main/ShareRecipe";
import FeaturedRecipes from "@/components/main/FeaturedRecipes";
import LatestRecipes from "@/components/main/LatestRecipesGrid";

const API_URL = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== "" 
  ? import.meta.env.VITE_API_URL 
  : "https://aroi-dee-backend.vercel.app";

interface Recipe {
  id: number;
  title: string;
  author: string;
  image_url: string;
  cook_time: number;
  calories: number;
  rating?: number | null;
  ingredients: string[];
  isFavorite: boolean;
}

const Homepage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // 📌 ดึงข้อมูลจาก Backend
  useEffect(() => {
    axios.get(`${API_URL}/api/recipes`)
      .then((response) => {
        if (response.data.success) {
          const fetchedRecipes = response.data.data.map((recipe: any) => ({
            id: recipe.id,
            title: recipe.title,
            author: recipe.users?.username || "Unknown",
            image_url: recipe.image_url || "/default-recipe.jpg",
            cook_time: recipe.cook_time || 0,
            calories: recipe.nutrition_facts?.[0]?.calories 
              ? Number(recipe.nutrition_facts[0].calories) 
              : 0, // ✅ แก้ให้ไม่ error
            rating: recipe.rating ?? null, // ✅ ตรวจสอบค่า rating
            ingredients: recipe.recipe_ingredients?.map((ing: any) => ing.ingredients?.name || "Unknown") || [],
            isFavorite: false,
          }));

          setRecipes(fetchedRecipes);
        } else {
          setError("Failed to load recipes.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes.");
        setLoading(false);
      });
  }, []);

  // 📌 ฟังก์ชัน Toggle Favorite
  const toggleFavorite = (index: number) => {
    setRecipes((prev) => prev.map((recipe, i) => 
      i === index ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <main className="container mx-auto py-6 px-4">
        <Categories />
        <FeaturedRecipes />

        {/* ✅ เพิ่ม loading & error handling */}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <Content topic="Recommended" recipes={recipes} toggleFavorite={toggleFavorite} />
        <LatestRecipes />
        
        {isAuthenticated && <ShareRecipe />}
      </main>
    </div>
  );
};

export default Homepage;
