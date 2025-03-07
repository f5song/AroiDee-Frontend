import axios from "axios";
import { Recipe, FilterOptions, PaginationInfo, CategoryOption } from "./types";
import { RECIPES_PER_PAGE, CATEGORIES } from "./constants";
// import { sortRecipes, filterRecipes, paginateData } from "./utils";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

// ✅ ฟังก์ชันจำลอง delay
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export type { FilterOptions, Recipe };

// ✅ ดึงสูตรอาหารจาก Backend
export const fetchRecipes = async (
  options: FilterOptions = {}
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  const { category, search, sort, page, cookingTime, difficulty, calorieRange } = options;

  try {
    await delay(500); // หน่วงเวลาจำลอง API
    const response = await axios.get(`${API_URL}/recipes`, {
      params: {
        category: category ?? "all",
        search: search ?? "",
        cookingTime,
        difficulty,
        calorieRange,
        page: page ?? 1,
        limit: RECIPES_PER_PAGE,
        sort: sort ?? "rating",
      },
    });

    console.log("✅ API Response:", response.data); // Debugging API Response
    return response.data; // ✅ ส่งข้อมูลกลับโดยไม่กรอง
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    return { recipes: [], pagination: { currentPage: page ?? 1, totalPages: 0, totalItems: 0 } };
  }
};


// ✅ ดึงสูตรอาหารที่ผู้ใช้บันทึก
export const getSavedRecipes = async (userId: number): Promise<number[]> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/saved-recipes`);
    return response.data?.savedRecipes.map((r: { recipe_id: number }) => r.recipe_id) ?? [];
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return [];
  }
};

// ✅ บันทึกสูตรอาหารลงฐานข้อมูล
export const saveRecipe = async (userId: number, recipeId: number): Promise<{ success: boolean }> => {
  try {
    await axios.post(`${API_URL}/users/save-recipe`, { user_id: userId, recipe_id: recipeId });
    return { success: true };
  } catch (error) {
    console.error("Error saving recipe:", error);
    return { success: false };
  }
};

// ✅ ยกเลิกการบันทึกสูตรอาหาร
export const unsaveRecipe = async (userId: number, recipeId: number): Promise<{ success: boolean }> => {
  try {
    await axios.post(`${API_URL}/users/unsave-recipe`, { user_id: userId, recipe_id: recipeId });
    return { success: true };
  } catch (error) {
    console.error("Error unsaving recipe:", error);
    return { success: false };
  }
};

// ✅ ดึงหมวดหมู่ทั้งหมด
export const fetchCategories = async (): Promise<CategoryOption[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data ?? CATEGORIES;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return CATEGORIES;
  }
};

// ✅ ฟังก์ชันดึงข้อมูลจากแหล่งที่กำหนด (User หรือ Favorite)
export const fetchRecipesBySource = async (
  source: "USER" | "FAVORITE",
  userId: number,
  options: FilterOptions = {} // ✅ รองรับตัวกรอง
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/${source.toLowerCase()}-recipes`, {
      params: options, // ✅ ใช้ options เป็นพารามิเตอร์
    });

    return {
      recipes: response.data?.recipes ?? [],
      pagination: response.data?.pagination ?? { currentPage: options.page ?? 1, totalPages: 0, totalItems: 0 },
    };
  } catch (error) {
    console.error(`Error fetching ${source.toLowerCase()} recipes:`, error);
    return { recipes: [], pagination: { currentPage: options.page ?? 1, totalPages: 0, totalItems: 0 } };
  }
};

// ✅ สลับสถานะบันทึก/เลิกบันทึกสูตรอาหาร
export const toggleFavoriteRecipe = async (userId: number, recipeId: number): Promise<{ success: boolean }> => {
  try {
    const savedRecipes = await getSavedRecipes(userId);
    const isSaved = savedRecipes.includes(recipeId);

    if (isSaved) {
      return await unsaveRecipe(userId, recipeId);
    } else {
      return await saveRecipe(userId, recipeId);
    }
  } catch (error) {
    console.error("Error toggling favorite recipe:", error);
    return { success: false };
  }
};
