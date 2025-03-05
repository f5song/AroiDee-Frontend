import { Recipe, FilterOptions, PaginationInfo, CategoryOption } from "./types";
import { DEFAULT_FILTER_OPTIONS } from "./constants";
import { getFavoriteIds } from "./storage";
import axios from "axios";

/**
 * ดึงสูตรอาหารจาก backend
 */
export const fetchRecipes = async (
  options: FilterOptions = {}
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  const { category, search, sort = DEFAULT_FILTER_OPTIONS.sort, page = DEFAULT_FILTER_OPTIONS.page, cookingTime, difficulty, calorieRange } = options;

  // สร้าง query parameters
  let queryParams = `?page=${page}&sort=${sort}`;
  if (category && category !== "all") queryParams += `&category=${category}`;
  if (search) queryParams += `&search=${search}`;
  if (cookingTime) queryParams += `&cookingTime=${cookingTime}`;
  if (difficulty) queryParams += `&difficulty=${difficulty}`;
  if (calorieRange) queryParams += `&calorieRange=${calorieRange}`;

  try {
    // เรียก API ดึงสูตรอาหารจาก backend
    const response = await axios.get(`https://aroi-dee-backend.vercel.app/api/recipes${queryParams}`);
    const { data } = response;

    return {
      recipes: data.data, // ตรวจสอบว่า response มีข้อมูลใน data หรือไม่
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw new Error("Failed to fetch recipes");
  }
};

/**
 * ดึงหมวดหมู่จาก backend
 */
export const fetchCategories = async (): Promise<CategoryOption[]> => {
  try {
    // เรียก API ดึงหมวดหมู่จาก backend
    const response = await axios.get("https://aroi-dee-backend.vercel.app/api/categories");
    const { data } = response;

    return data.data; // ตรวจสอบว่า response มีข้อมูลหมวดหมู่ใน data หรือไม่
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

/**
 * ดึงสูตรอาหารโปรดจาก backend
 */
export const fetchFavoriteRecipes = async (
  options: FilterOptions = {}
): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
  const { search, sort = DEFAULT_FILTER_OPTIONS.sort, page = DEFAULT_FILTER_OPTIONS.page, cookingTime, difficulty, calorieRange } = options;

  let favoriteIds = getFavoriteIds();

  // ถ้าไม่มีรายการโปรด ใช้ค่าเริ่มต้น
  if (favoriteIds.length === 0) {
    favoriteIds = []; // ดึงรายการโปรดจาก API แทน
  }

  // สร้าง query parameters
  let queryParams = `?page=${page}&sort=${sort}&favoriteIds=${favoriteIds.join(",")}`;
  if (search) queryParams += `&search=${search}`;
  if (cookingTime) queryParams += `&cookingTime=${cookingTime}`;
  if (difficulty) queryParams += `&difficulty=${difficulty}`;
  if (calorieRange) queryParams += `&calorieRange=${calorieRange}`;

  try {
    // เรียก API ดึงสูตรอาหารโปรดจาก backend
    const response = await axios.get(`https://aroi-dee-backend.vercel.app/api/recipes/favorites${queryParams}`);
    const { data } = response;

    return {
      recipes: data.data, // ตรวจสอบว่า response มีข้อมูลใน data หรือไม่
      pagination: data.pagination
    };
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    throw new Error("Failed to fetch favorite recipes");
  }
};
