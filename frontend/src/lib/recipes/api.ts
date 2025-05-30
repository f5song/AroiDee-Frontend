import axios from "axios";
import { Recipe, FilterOptions, PaginationInfo, CategoryOption } from "./types";
import { CATEGORIES } from "./constants";
// import { sortRecipes, filterRecipes, paginateData } from "./utils";

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app";

export type { FilterOptions, Recipe };


export const fetchRecipes = async (
  options: FilterOptions = {}
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  const { search, sort, page, category, cookingTime, calorieRange } = options; // ✅ เพิ่ม cookingTime และ calorieRange

  try {
    const response = await axios.get(`${API_URL}/api/recipes`, {
      params: {
        search: search ?? "",
        sort: sort ?? "rating",
        category: category !== "all" ? category : undefined,
        cookingTime: cookingTime !== 30 ? cookingTime : undefined,
        calorieRange: calorieRange !== 500 ? calorieRange : undefined,
        page: page ?? 1,
      },
    });

    console.log("✅ API Response fetchRecipes:", response.data);
    const recipes = response.data?.data ?? [];

    return {
      recipes,
      pagination: {
        currentPage: page ?? 1,
        totalPages: 1,
        totalItems: recipes.length,
      },
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


/**
 * ✅ บันทึกสูตรอาหารลงฐานข้อมูล
 */
export const saveRecipe = async (userId: number, recipeId: number): Promise<{ success: boolean }> => {
  try {
    await axios.post(`${API_URL}/saved-recipes/save-recipe`, { user_id: userId, recipe_id: recipeId });
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving recipe api.ts:", error);
    return { success: false };
  }
};

/**
 * ✅ ยกเลิกการบันทึกสูตรอาหาร
 */
export const unsaveRecipe = async (userId: number, recipeId: number): Promise<{ success: boolean }> => {
  try {
    await axios.post(`${API_URL}/saved-recipes/unsave-recipe`, { user_id: userId, recipe_id: recipeId });
    return { success: true };
  } catch (error) {
    console.error("❌ Error unsaving recipe:", error);
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
