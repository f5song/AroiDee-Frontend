import { apiClient } from "../apiClient";
import axios from "axios";

export const getRecipeById = async (recipeId: string) => {
  const response = await apiClient.get(`/recipes/${recipeId}`);

  // 🔍 Debug: ตรวจสอบค่าที่ API ส่งกลับมา
  console.log("API Full Response:", response.data);

  // ✅ ดึงข้อมูลสูตรอาหารจาก `data`
  return response.data?.data ?? null;
};


export const createRecipe = async (recipeData: any, token: string) => {
  try {
    const response = await axios.post(
      "https://aroi-dee-backend.vercel.app/api/recipes/create",
      recipeData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ ส่ง Token ไปให้ API
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, error: "Failed to create recipe" };
  }
};