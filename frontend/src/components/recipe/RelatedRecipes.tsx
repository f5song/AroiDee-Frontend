import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { RelatedRecipesProps } from "../../types/recipe";

interface RelatedRecipesWithSkeletonProps extends RelatedRecipesProps {
  isLoading?: boolean;
}

const RelatedRecipes: React.FC<RelatedRecipesWithSkeletonProps> = ({ recipes, isLoading = false }) => {
  const navigate = useNavigate();

  const skeletons = Array.from({ length: 3 });

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">You Might Also Like</h2>

      <div className="space-y-4">
        {isLoading
          ? skeletons.map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="flex space-x-2 items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div className="w-20 h-3 bg-gray-200 rounded" />
                    <div className="w-2 h-2" />
                    <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    <div className="w-10 h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))
          : recipes && recipes.length > 0
          ? recipes.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(`/recipe/${item.id}`)}
                className="flex items-center space-x-4 group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={item.image_url || "/default-recipe.jpg"}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg group-hover:shadow-md transition-all"
                />
                <div>
                  <h3 className="font-medium group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>
                      {item.cook_time ? `${item.cook_time} minutes` : "Time not specified"}
                    </span>
                    <span className="mx-2">•</span>
                    <Star size={14} className="mr-1 text-yellow-400" fill="currentColor" />
                    <span>
                      {item.rating && !isNaN(Number(item.rating))
                        ? Number(item.rating).toFixed(1)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          : <p className="text-gray-500">No related recipes available</p>}
      </div>
    </div>
  );
};

export default RelatedRecipes;
