import { apiClient } from "../apiClient";

export const getRecipeById = async (recipeId: string) => {
  const response = await apiClient.get(`/recipes/${recipeId}`);

  // 🔍 Debug: เช็คค่าที่ API ส่งกลับมา
  console.log("API Full Response:", response.data);

  // ✅ ดึงข้อมูลสูตรอาหารจาก `data`
  return response.data?.data || null;
};
