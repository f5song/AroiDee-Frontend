import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RecipeCard from "./RecipeCard";

interface Recipe {
    id: number;
    title: string;
    author: string;
    image: string;
    cookTime: number; // 🔹 ให้ cookTime เป็น number
    calories: number;
    rating?: number | null;
    ingredients: string[];
    isFavorite: boolean;
}


const API_URL =
  import.meta.env.VITE_API_URL || "https://aroi-dee-backend.vercel.app";

const Content: React.FC<{ topic?: string }> = ({ topic }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ดึงข้อมูลจาก Backend
  useEffect(() => {
    axios
      .get(`${API_URL}/api/recipes`)
      .then((response) => {
        const fetchedRecipes = response.data.data.map((recipe: any) => ({
          id: recipe.id,
          title: recipe.title,
          author: recipe.author || "Unknown",
          image: recipe.image_url || "/default-recipe.jpg",
          cookTime: recipe.cook_time || 0, // 🔹 ให้เก็บ cookTime เป็น number
          calories: recipe.nutrition_facts?.calories || 0,
          rating: null, // เว้นไว้ก่อน
          ingredients:
            recipe.recipe_ingredients?.map(
              (ing: any) => ing.ingredients.name
            ) || [],
          isFavorite: false,
        }));

        setRecipes(fetchedRecipes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes.");
        setLoading(false);
      });
  }, []);

  // ฟังก์ชันเลื่อน Carousel
  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  // ฟังก์ชัน Toggle Favorite
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
    <section className="container mx-auto py-6 px-4 relative">
      {/* Topic Title */}
      {topic && <h3 className="text-3xl font-bold mb-4">{topic}</h3>}

      {/* Recipe Carousel Container */}
      <div className="relative">
        {/* Scrollable Recipe List */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
        >
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              className="snap-center flex-shrink-0 w-[320px]"
            >
              <RecipeCard
                recipe={recipe}
                onToggleFavorite={() => toggleFavorite(index)}
              />
            </motion.div>
          ))}
        </div>

        {/* Arrow Navigation */}
        {recipes.length > 3 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Content;
