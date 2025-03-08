import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../lib/api/recipeApi";

const RecipePage: React.FC = () => {
  const { recipeId } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(recipeId as string);
        console.log("📌 API Response in Frontend:", recipe);
      } catch (error) {
        console.error("🚨 API Fetch Error:", error);
      }
    };

    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  return <p>🔍 กำลังทดสอบ API ... ดู Console Log</p>;
};

export default RecipePage;
