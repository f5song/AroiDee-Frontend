import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../lib/api/recipeApi";

const RecipePage: React.FC = () => {
  const { recipeId } = useParams();

  useEffect(() => {
    console.log("🔄 useEffect is running", recipeId);

    const fetchRecipe = async () => {
      try {
        console.log("🚀 Fetching API for Recipe ID:", recipeId);
        const recipe = await getRecipeById(recipeId as string);
        console.log("📌 API Response in Frontend:", recipe);
      } catch (error) {
        console.error("🚨 API Fetch Error:", error);
      }
    };

    if (recipeId) {
      fetchRecipe();
    } else {
      console.warn("⚠️ No recipeId provided!");
    }
  }, [recipeId]);

  return <p>🔍 กำลังทดสอบ API ... ดู Console Log</p>;
};

export default RecipePage;
