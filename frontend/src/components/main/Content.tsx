import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RecipeCard from "./RecipeCard";

interface Recipe {
  id: number;
  title: string;
  author: string;
  image_url?: string;
  cook_time?: number;
  calories?: number;
  rating?: number | null;
  ingredients: string[];
  isFavorite: boolean;
}

interface ContentProps {
  topic?: string;
  recipes: Recipe[];
  toggleFavorite: (index: number) => void;
}

const Content: React.FC<ContentProps> = ({ topic, recipes, toggleFavorite }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="container mx-auto py-6 px-4 relative">
      {topic && <h3 className="text-3xl font-bold mb-4">{topic}</h3>}

      <div className="relative">
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar">
          {recipes.map((recipe, index) => (
            <motion.div key={recipe.id} className="snap-center flex-shrink-0 w-[320px]">
              <RecipeCard
                recipe={{
                  ...recipe,
                  cook_time: recipe.cook_time ?? 0, // ✅ ถ้า cook_time ไม่มีค่า ให้ใช้ 0
                  calories: recipe.calories ?? 0, // ✅ ถ้า calories ไม่มีค่า ให้ใช้ 0
                }}
                onToggleFavorite={() => toggleFavorite(index)}
              />
            </motion.div>
          ))}
        </div>

        {recipes.length > 3 && (
          <>
            <button onClick={handlePrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition">
              <ArrowRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default Content;
