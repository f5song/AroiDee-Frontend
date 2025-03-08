import { apiClient } from "../apiClient";

export const getRecipeById = async (recipeId: string) => {
  const response = await apiClient.get(`/recipes/${recipeId}`);
  
  // 🔍 Debug: เช็คข้อมูลที่ได้จาก API
  console.log("API Response:", response.data);

  return response.data;
};
