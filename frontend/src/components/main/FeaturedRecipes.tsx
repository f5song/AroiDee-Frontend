import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";

const FeaturedRecipes = () => {
  const [recipes, setRecipes] = useState<
    { id: number; title: string; image_url?: string; author: string; views: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/recipes`)
      .then((response) => {
        const allRecipes = response.data.data;

        if (!allRecipes || allRecipes.length === 0) {
          setError("No recipes found.");
          setLoading(false);
          return;
        }

        // สุ่ม 6 รายการจาก recipes
        const shuffledRecipes = allRecipes.sort(() => 0.5 - Math.random()).slice(0, 6);
        setRecipes(shuffledRecipes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6">Super Delicious</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse"
            >
              <div className="relative">
                <div className="w-full h-48 bg-gray-300" />
              </div>

              <div className="p-4">
                <div className="w-full h-6 bg-gray-300 rounded mb-2" />
                <div className="w-24 h-4 bg-gray-300 rounded mb-4" />
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Super Delicious</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="block">
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img
                  src={recipe.image_url || "/default-recipe.jpg"}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg mb-1 line-clamp-2">{recipe.title}</h3>
                <div className="flex items-center mt-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2"></div>
                  <span className="text-sm text-gray-600">{recipe.author || "Unknown"}</span>
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <div className="flex items-center">
                    <span className="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span>Yesterday</span>
                  </div>

                  <div className="flex items-center ml-4">
                    <span className="mr-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </span>
                    <span>{recipe.views || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRecipes;
