import axios from "axios";
import { Recipe, FilterOptions, PaginationInfo, CategoryOption } from "./types";
import { CATEGORIES } from "./constants";
// import { sortRecipes, filterRecipes, paginateData } from "./utils";

const API_URL = "https://aroi-dee-backend.vercel.app/api";

export type { FilterOptions, Recipe };


export const fetchRecipes = async (
  options: FilterOptions = {}
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  const { search, sort, page } = options;

  try {
    const response = await axios.get(`${API_URL}/recipes`, {
      params: {
        search: search ?? "",
        sort: sort ?? "rating",
        page: page ?? 1,
      },
    });

    console.log("✅ API Response:", response.data); // Debug API Response

    return {
      recipes: response.data?.recipes ?? [],
      pagination: response.data?.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0 },
    };
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    return { recipes: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0 } };
  }
};




// ✅ ดึงสูตรอาหารที่ผู้ใช้บันทึก
export const getSavedRecipes = async (userId: number): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/saved-recipes/${userId}/saved-recipes`);
    return response.data ?? [];
  } catch (error) {
    console.error("❌ Error fetching saved recipes:", error);
    return []; // ✅ ป้องกัน undefined
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
