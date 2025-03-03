// components/RecipeStats.tsx
import React from "react";
import { TAB_VALUES } from "@/pages/MyRecipes";

interface RecipeStatsProps {
  recipeCount: number;
  activeTab: string;
}

const RecipeStats: React.FC<RecipeStatsProps> = ({ recipeCount, activeTab }) => {
  const recipeType = activeTab === TAB_VALUES.MY_RECIPES ? "personal" : "saved";
  
  if (recipeCount === 0) {
    return (
      <p className="text-gray-500">
        No {recipeType} recipes yet
      </p>
    );
  }
  
  return (
    <p className="text-gray-500">
      You have {recipeCount} {recipeType} recipes
    </p>
  );
};

export default RecipeStats;