import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ใช้ค่าจาก .env

export const api = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ดึงข้อมูลสูตรอาหารทั้งหมด
export const fetchRecipes = async () => {
  try {
    const response = await api.get("/api/recipes");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    throw error;
  }
};

// เพิ่มสูตรอาหารใหม่
export const createRecipe = async (recipeData: any) => {
  try {
    const response = await api.post("/api/recipes", recipeData);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating recipe:", error);
    throw error;
  }
};
