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
  getFavoriteIds,
  saveFavoriteIds
} from "./storage";
import { 
  sortRecipes, 
  filterRecipes,
  paginateData
} from "./utils";

// ใช้ axios หรือ fetch ในการดึงข้อมูลจาก backend
import axios from 'axios';

/**
* สร้างการหน่วงเวลาจำลอง
*/
const delay = (ms: number): Promise<void> => {
return new Promise(resolve => setTimeout(resolve, ms));
};

/**
* ดึงสูตรอาหารจาก backend
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

  try {
    // ดึงข้อมูลจาก backend API แทนการใช้ MOCK_RECIPES
    const response = await axios.get('https://aroi-dee-backend.vercel.app/api/recipes', {
      params: {
        category: categories.length > 0 ? categories : undefined, // ส่งหมวดหมู่ถ้ามี
        search,
        cookingTime,
        difficulty,
        calorieRange,
        page,
        limit: RECIPES_PER_PAGE,  // กำหนดจำนวนสูตรอาหารต่อหน้า
        sort,
      }
    });

    // ใช้ type assertion แปลง response.data.data เป็น Recipe[]
    let filteredRecipes = response.data.data as Recipe[];

    // กรองสูตรอาหารตามเงื่อนไข
    filteredRecipes = filterRecipes(filteredRecipes, categories, search, cookingTime, difficulty, calorieRange);

    // เรียงลำดับผลลัพธ์
    if (sort) {
      filteredRecipes = sortRecipes(filteredRecipes, sort);
    }

    // แบ่งหน้า
    const { items, total, totalPages } = paginateData(filteredRecipes, page, RECIPES_PER_PAGE);

    return {
      recipes: items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
      },
    };
  } catch (error) {
    console.error('Error fetching recipes from backend:', error);
    return {
      recipes: [],
      pagination: { currentPage: page, totalPages: 0, totalItems: 0 }
    };
  }
};


/**
* ดึงสูตรอาหารที่ผู้ใช้สร้างจาก backend
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

try {
  // ดึงข้อมูลจาก backend API แทนการใช้ MOCK_USER_RECIPES
  const response = await axios.get('https://aroi-dee-backend.vercel.app/user/recipes', {
    params: {
      search,
      cookingTime,
      difficulty,
      calorieRange,
      page,
      sort,
    }
  });

  const { data, total, totalPages } = response.data;

  return {
    recipes: data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
    },
  };
} catch (error) {
  console.error('Error fetching user recipes from backend:', error);
  return {
    recipes: [],
    pagination: { currentPage: page, totalPages: 0, totalItems: 0 }
  };
}
};

/**
* ดึงสูตรอาหารโปรดจาก backend
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
  favoriteIds = [];
}

// จำลองการเรียก API
await delay(500);

try {
  // ดึงข้อมูลจาก backend API แทนการใช้สูตรที่เก็บไว้ใน MOCK_RECIPES
  const response = await axios.get('https://aroi-dee-backend.vercel.app/recipes/favorites', {
    params: {
      favoriteIds: favoriteIds,
      search,
      cookingTime,
      difficulty,
      calorieRange,
      page,
      sort,
    }
  });

  const { data, total, totalPages } = response.data;

  return {
    recipes: data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
    },
  };
} catch (error) {
  console.error('Error fetching favorite recipes from backend:', error);
  return {
    recipes: [],
    pagination: { currentPage: page, totalPages: 0, totalItems: 0 }
  };
}
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
* ดึงสูตรอาหารตาม ID จาก backend
*/
export const fetchRecipeById = async (id: number): Promise<Recipe | null> => {
// จำลองการเรียก API
await delay(300);

try {
  const response = await axios.get(`https://aroi-dee-backend.vercel.app/recipes/${id}`);
  return response.data || null;
} catch (error) {
  console.error('Error fetching recipe by ID from backend:', error);
  return null;
}
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
* ดึงหมวดหมู่ทั้งหมดจาก backend
*/
export const fetchCategories = async (): Promise<CategoryOption[]> => {
  // จำลองการเรียก API
  await delay(200);

  try {
    const response = await axios.get('https://aroi-dee-backend.vercel.app/api/categories');
    return response.data || CATEGORIES;  // ถ้าไม่สามารถดึงหมวดหมู่จาก API ได้ จะใช้ค่าพื้นฐานจาก CATEGORIES
  } catch (error) {
    console.error('Error fetching categories from backend:', error);
    return CATEGORIES;  // ใช้หมวดหมู่เริ่มต้นในกรณีที่เกิดข้อผิดพลาด
  }
};