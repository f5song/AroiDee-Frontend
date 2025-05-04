import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
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
  author: string;
  image_url: string;
  cook_time: number;
  calories: number;
  rating?: number | null;
  ingredients: string[];
  isFavorite: boolean;
  created_at?: string;
}

const Homepage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/recipes`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.success) {
          const fetchedRecipes = response.data.data.map((recipe: any) => ({
            id: recipe.id,
            title: recipe.title,
            author: recipe.author || "Unknown",
            image_url: recipe.image_url || "/default-recipe.jpg",
            cook_time: recipe.cook_time ?? 0,
            calories: recipe.calories ?? 0,
            rating: recipe.rating ?? null,
            ingredients: recipe.ingredients || [],
            isFavorite: false,
            created_at: recipe.created_at,
          }));

          setRecipes(fetchedRecipes);

          // จัดเรียงตามเวลาที่สร้าง (ล่าสุดก่อน)
          const sortedLatestRecipes = [...fetchedRecipes].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });

          setLatestRecipes(sortedLatestRecipes);
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

  // Toggle Favorite สำหรับ Content component
  const toggleFavorite = (index: number) => {
    setRecipes((prev) =>
      prev.map((recipe, i) =>
        i === index ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };

  // Toggle Favorite สำหรับ Latest Recipes (โดยใช้ id)
  const toggleLatestFavorite = (id: number) => {
    // อัพเดตสถานะ favorite ในทั้ง latestRecipes และ recipes
    setLatestRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );

    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <main className="container mx-auto py-6 px-4">
        <Categories />
        <FeaturedRecipes />
        <Content
          topic="Recommended Recipes"
          recipes={recipes}
          toggleFavorite={toggleFavorite}
          loading={loading}
        />
        {!loading && (
          <LatestRecipes
            recipes={latestRecipes}
            toggleFavorite={toggleLatestFavorite}
          />
        )}

        {isAuthenticated && <ShareRecipe />}
      </main>
    </div>
  );
};

export default Homepage;
