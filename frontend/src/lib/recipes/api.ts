// lib/recipes/api.ts
import { 
    Recipe, 
    FilterOptions, 
    PaginationInfo, 
    RecipeSource,
    CategoryOption
  } from "./types";
  import { 
    RECIPES_PER_PAGE, 
    CATEGORIES,
    DEFAULT_FILTER_OPTIONS 
  } from "./constants";
  import { 
    MOCK_RECIPES, 
    MOCK_USER_RECIPES,
    DEFAULT_FAVORITE_IDS, 
    getAllRecipes 
  } from "./mock-data";
  import { 
    sortRecipes, 
    filterRecipes,
    paginateData
  } from "./utils";
  import {
    getFavoriteIds,
    saveFavoriteIds
  } from "./storage";
  
  /**
   * สร้างการหน่วงเวลาจำลอง
   */
  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  /**
   * ดึงสูตรอาหารพร้อมการกรอง การเรียงลำดับ และการแบ่งหน้า
   */
  export const fetchRecipes = async (
    options: FilterOptions = {}
  ): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
    const { 
      category, 
      search, 
      sort = DEFAULT_FILTER_OPTIONS.sort, 
      page = DEFAULT_FILTER_OPTIONS.page, 
      cookingTime, 
      difficulty, 
      calorieRange 
    } = options;
    
    // จำลองการเรียก API
    await delay(500);
  
    // แปลงหมวดหมู่เป็นรายการแท็ก
    let categories: string[] = [];
    if (category && category !== "all") {
      categories = [category];
    }
  
    // กรองสูตรอาหาร
    let filtered = filterRecipes(
      MOCK_RECIPES, 
      categories, 
      search, 
      cookingTime, 
      difficulty,
      calorieRange
    );
  
    // เรียงลำดับผลลัพธ์
    if (sort) {
      filtered = sortRecipes(filtered, sort);
    }
  
    // แบ่งหน้า
    const { items, total, totalPages } = paginateData(filtered, page, RECIPES_PER_PAGE);
  
    return {
      recipes: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    };
  };
  
  /**
   * ดึงสูตรอาหารที่ผู้ใช้สร้าง
   */
  export const fetchUserRecipes = async (
    options: FilterOptions = {}
  ): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
    const { 
      search, 
      sort = DEFAULT_FILTER_OPTIONS.sort, 
      page = DEFAULT_FILTER_OPTIONS.page, 
      cookingTime, 
      difficulty, 
      calorieRange 
    } = options;
    
    // จำลองการเรียก API
    await delay(500);
  
    // กรองสูตรอาหารของผู้ใช้
    let filtered = filterRecipes(
      MOCK_USER_RECIPES, 
      [], 
      search, 
      cookingTime, 
      difficulty,
      calorieRange
    );
  
    // เรียงลำดับผลลัพธ์
    if (sort) {
      filtered = sortRecipes(filtered, sort);
    }
  
    // แบ่งหน้า
    const { items, total, totalPages } = paginateData(filtered, page, RECIPES_PER_PAGE);
  
    return {
      recipes: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    };
  };
  
  /**
   * ดึงสูตรอาหารโปรด
   */
  export const fetchFavoriteRecipes = async (
    options: FilterOptions = {}
  ): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
    const { 
      search, 
      sort = DEFAULT_FILTER_OPTIONS.sort, 
      page = DEFAULT_FILTER_OPTIONS.page, 
      cookingTime, 
      difficulty, 
      calorieRange 
    } = options;
    
    // ดึงรายการโปรดจาก localStorage
    let favoriteIds = getFavoriteIds();
    
    // ถ้าไม่มีรายการโปรด ใช้ค่าเริ่มต้นสำหรับการแสดงตัวอย่าง
    if (favoriteIds.length === 0) {
      favoriteIds = DEFAULT_FAVORITE_IDS;
    }
  
    // จำลองการเรียก API
    await delay(500);
  
    // กรองเฉพาะสูตรอาหารโปรด
    let favoriteRecipes = getAllRecipes().filter(recipe => 
      favoriteIds.includes(recipe.id)
    );
  
    // กรองตามเงื่อนไข
    let filtered = filterRecipes(
      favoriteRecipes, 
      [], 
      search, 
      cookingTime, 
      difficulty,
      calorieRange
    );
  
    // เรียงลำดับผลลัพธ์
    if (sort) {
      filtered = sortRecipes(filtered, sort);
    }
  
    // แบ่งหน้า
    const { items, total, totalPages } = paginateData(filtered, page, RECIPES_PER_PAGE);
  
    return {
      recipes: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    };
  };
  
  /**
   * ดึงสูตรอาหารจากแหล่งที่กำหนด (ทั้งหมด, ของผู้ใช้, หรือรายการโปรด)
   */
  export const fetchRecipesBySource = async (
    source: RecipeSource,
    options: FilterOptions = {}
  ): Promise<{ recipes: Recipe[]; pagination: PaginationInfo }> => {
    switch (source) {
      case RecipeSource.USER:
        return fetchUserRecipes(options);
      case RecipeSource.FAVORITE:
        return fetchFavoriteRecipes(options);
      case RecipeSource.ALL:
      default:
        return fetchRecipes(options);
    }
  };
  
  /**
   * ดึงสูตรอาหารตาม ID
   */
  export const fetchRecipeById = async (id: number): Promise<Recipe | null> => {
    // จำลองการเรียก API
    await delay(300);
    
    return getAllRecipes().find(recipe => recipe.id === id) || null;
  };
  
  /**
   * สลับสถานะรายการโปรดและบันทึกลง localStorage
   */
  export const toggleFavoriteRecipe = async (id: number): Promise<{ success: boolean }> => {
    try {
      // อ่านรายการโปรดปัจจุบัน
      let favorites = getFavoriteIds();
      
      // สลับสถานะรายการโปรด
      if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
      } else {
        favorites.push(id);
      }
      
      // บันทึกลง localStorage
      const success = saveFavoriteIds(favorites);
      
      return { success };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return { success: false };
    }
  };
  
  /**
   * ตรวจสอบว่าสูตรอาหารเป็นรายการโปรดหรือไม่
   */
  export const isFavoriteRecipe = (id: number): boolean => {
    const favorites = getFavoriteIds();
    return favorites.includes(id);
  };
  
  /**
   * ดึงหมวดหมู่ทั้งหมด
   */
  export const fetchCategories = async (): Promise<CategoryOption[]> => {
    // จำลองการเรียก API
    await delay(200);
    
    return CATEGORIES;
  };