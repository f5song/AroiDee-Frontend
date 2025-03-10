import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

interface LatestRecipesProps {
  recipes: Recipe[];
  toggleFavorite: (id: number) => void;
}

const LatestRecipes: React.FC<LatestRecipesProps> = ({ recipes, toggleFavorite }) => {
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  // เรียงลำดับตาม created_at ใหม่สุดก่อน (กรณีที่รับมาแล้วต้องการเรียงใหม่)
  const sortedRecipes = [...recipes].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  const displayedRecipes = sortedRecipes.slice(0, visibleCount);

  return (
    <section className="container mx-auto py-10 px-4">
      <motion.h2 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Latest Recipes
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedRecipes.map((recipe, index) => (
          <motion.div 
            key={recipe.id} 
            className="group cursor-pointer"
            variants={itemVariants}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 mb-2 rounded-lg">
              <img 
                src={recipe.image_url || "/default-recipe.jpg"} 
                alt={recipe.title} 
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Favorite Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(recipe.id);
                }}
                className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition-colors duration-200 hover:bg-gray-100"
              >
                <Heart 
                  className={`h-5 w-5 ${recipe.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} 
                />
              </button>
              
              {/* Cook Time Badge */}
              {recipe.cook_time > 0 && (
                <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                  <Clock className="mr-1 h-3 w-3 text-orange-500" />
                  {recipe.cook_time} mins
                </div>
              )}
            </div>
            
            {/* Recipe Info */}
            <div>
              {/* Recipe Title */}
              <h3 className="text-sm font-medium line-clamp-2">{recipe.title}</h3>
              
              {/* Author */}
              <p className="text-xs text-gray-500 mt-1">by {recipe.author || "Anonymous"}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Load More Button */}
      {recipes.length > visibleCount && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="border-gray-300 hover:bg-gray-50"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default LatestRecipes;