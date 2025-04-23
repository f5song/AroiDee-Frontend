import React from "react";
import { IngredientsTabProps, Ingredient } from "../../types/recipe";

interface IngredientsTabWithSkeletonProps extends IngredientsTabProps {
  isLoading?: boolean;
}

const IngredientsTab: React.FC<IngredientsTabWithSkeletonProps> = ({
  ingredients = [],
  checkedIngredients,
  handleIngredientClick,
  isLoading = false, // ✅ เพิ่ม default
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
      </div>

      <ul className="space-y-3 mb-6">
        {isLoading ? (
          // ✅ แสดง Skeleton Loading UI
          Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center p-4 bg-gray-100 rounded-xl animate-pulse"
            >
              <div className="w-5 h-5 rounded-full bg-gray-300 mr-4" />
              <div className="h-4 w-2/3 bg-gray-300 rounded" />
            </li>
          ))
        ) : ingredients.length > 0 ? (
          ingredients.map((item: Ingredient, index: number) => (
            <li
              key={item.id || index}
              className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => handleIngredientClick(index)}
            >
              <input
                type="checkbox"
                checked={checkedIngredients[index] ?? false}
                onChange={() => handleIngredientClick(index)}
                className="w-5 h-5 rounded-full cursor-pointer accent-orange-500 mr-4"
              />
              <span
                className={
                  checkedIngredients[index]
                    ? "line-through text-gray-400"
                    : "text-gray-700 font-medium"
                }
              >
                {item.name} - {item.quantity} {item.unit}
              </span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No ingredients found</p>
        )}
      </ul>
    </div>
  );
};

export default IngredientsTab;
