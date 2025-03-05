import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthContext";
import Hero from "@/components/main/Hero";
import Categories from "@/components/main/Categories";
import Content from "@/components/main/Content";
import ShareRecipe from "@/components/main/ShareRecipe";
import FeaturedRecipes from "@/components/main/FeaturedRecipes";
import LatestRecipes from "@/components/main/LatestRecipesGrid";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";

interface Recipe {
  id: number;
  title: string;
  author: string; // ✅ ใช้ค่า `users.username`
  image: string;
  cookTime: number;
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
    axios
      .get(`${API_URL}/api/recipes`)
      .then((response) => {
        if (response.data.success) {
          const fetchedRecipes = response.data.data.map((recipe: any) => ({
            id: recipe.id,
            title: recipe.title,
            author: recipe.users?.username || "Unknown", // ✅ ใช้ `users.username`
            image: recipe.image_url || "/default-recipe.jpg",
            cookTime: recipe.cook_time || 0,
            calories: recipe.nutrition_facts?.calories || 0,
            rating: recipe.rating || null,
            ingredients:
              recipe.recipe_ingredients?.map((ing: any) => ing.ingredients.name) || [],
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
    setRecipes((prev) =>
      prev.map((recipe, i) =>
        i === index ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />
      <main className="container mx-auto py-6 px-4">
        {/* Popular Categories */}
        <Categories />
        {/* Featured Recipes */}
        <FeaturedRecipes />
        {/* Recommended Recipes */}
        <Content topic="Recommended" recipes={recipes} toggleFavorite={toggleFavorite} />
        {/* Most Popular Recipes */}
        <Content topic="Most Popular Recipes" recipes={recipes} toggleFavorite={toggleFavorite} />
        {/* Latest Recipes Grid */}
        <LatestRecipes />
        {/* Share Recipe - only shown to authenticated users */}
        {isAuthenticated && <ShareRecipe />}
      </main>
    </div>
  );
};

export default Homepage;
