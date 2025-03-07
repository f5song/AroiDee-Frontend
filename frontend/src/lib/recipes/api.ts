import axios from "axios";
import { Recipe, FilterOptions, PaginationInfo, CategoryOption } from "./types";
import { RECIPES_PER_PAGE, CATEGORIES } from "./constants";
import { sortRecipes, filterRecipes, paginateData } from "./utils";

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
    await delay(500);
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

    const fetchedRecipes: Recipe[] = response.data?.recipes ?? [];

    // ✅ กรองข้อมูลที่ frontend
    const filteredRecipes = filterRecipes(fetchedRecipes, category ? [category] : [], search, cookingTime, difficulty, calorieRange);

    // ✅ เรียงลำดับข้อมูล
    const sortedRecipes = sortRecipes(filteredRecipes, sort ?? "rating");

    // ✅ แบ่งหน้าข้อมูล
    const { items, total, totalPages } = paginateData(sortedRecipes, page ?? 1, RECIPES_PER_PAGE);

    return {
      recipes: items,
      pagination: {
        currentPage: page ?? 1,
        totalPages,
        totalItems: total,
      },
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { recipes: [], pagination: { currentPage: page ?? 1, totalPages: 0, totalItems: 0 } };
  }
};

// ✅ ดึงสูตรอาหารที่ผู้ใช้บันทึก
export const getSavedRecipes = async (userId: number): Promise<{ recipe_id: number }[]> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/saved-recipes`);
    return response.data?.savedRecipes ?? [];
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    return [];
  }
};

// ✅ บันทึกสูตรอาหารลงฐานข้อมูล
export const saveRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/users/save-recipe`, { user_id: userId, recipe_id: recipeId });
    return true;
  } catch (error) {
    console.error("Error saving recipe:", error);
    return false;
  }
};

// ✅ ยกเลิกการบันทึกสูตรอาหาร
export const unsaveRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/users/unsave-recipe`, { user_id: userId, recipe_id: recipeId });
    return true;
  } catch (error) {
    console.error("Error unsaving recipe:", error);
    return false;
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
  userId?: number
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  if (!userId) {
    return { recipes: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }

  try {
    const response = await axios.get(`${API_URL}/users/${userId}/${source.toLowerCase()}-recipes`);
    return {
      recipes: response.data?.recipes ?? [],
      pagination: response.data?.pagination ?? { currentPage: 1, totalPages: 0, totalItems: 0 },
    };
  } catch (error) {
    console.error(`Error fetching ${source.toLowerCase()} recipes:`, error);
    return { recipes: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } };
  }
};

// ✅ สลับสถานะบันทึก/เลิกบันทึกสูตรอาหาร
export const toggleFavoriteRecipe = async (userId: number, recipeId: number): Promise<boolean> => {
  try {
    const savedRecipes = await getSavedRecipes(userId);
    const isSaved = savedRecipes.some((r) => r.recipe_id === recipeId);

    if (isSaved) {
      return await unsaveRecipe(userId, recipeId);
    } else {
      return await saveRecipe(userId, recipeId);
    }
  } catch (error) {
    console.error("Error toggling favorite recipe:", error);
    return false;
  }
};
