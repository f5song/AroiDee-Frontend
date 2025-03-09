import React from "react";
import { NutritionFactsProps } from "../../types/recipe";

const NutritionFacts: React.FC<NutritionFactsProps> = ({ nutrition }) => {
  // Set maximum values for each nutrient (can be adjusted as needed)
  const maxValues: { [key: string]: number } = {
    calories: 500,
    total_fat: 30,
    saturated_fat: 15,
    cholesterol: 100,
    sodium: 500,
    potassium: 1000,
    total_carbohydrate: 100,
    sugars: 50,
    protein: 50
  };

  // Colors for each nutrient
  const colorMap: { [key: string]: string } = {
    calories: "bg-orange-500",
    total_fat: "bg-red-500",
    saturated_fat: "bg-purple-500",
    cholesterol: "bg-orange-400",
    sodium: "bg-yellow-500",
    potassium: "bg-green-500",
    total_carbohydrate: "bg-blue-500",
    sugars: "bg-yellow-800",
    protein: "bg-indigo-500"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Nutrition Facts</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(nutrition).map(([key, value]) => {
          const max = maxValues[key] || 100; // Set max value if not found
          const percentage = Math.min(100, (value / max) * 100); // Prevent values over 100%
          const barColor = colorMap[key] || "bg-gray-400"; // Default to gray if not in colorMap

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${barColor}`}></div>
                  <span className="capitalize text-gray-700">
                    {key.replace("_", " ")}
                  </span>
                </div>
                <span className="font-medium">{value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${barColor}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionFacts;