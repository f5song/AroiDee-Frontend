import { apiClient } from "../apiClient";

export const getRecipeById = async (recipeId: string) => {
  const response = await apiClient.get(`/recipes/${recipeId}`);

  // 🔍 Debug: เช็คว่าข้อมูลถูกต้องไหม
  console.log("API Full Response:", response.data);

  // ✅ ดึงสูตรอาหารออกมาจาก `savedRecipes`
  return response.data.savedRecipes?.[0] || null;
};
