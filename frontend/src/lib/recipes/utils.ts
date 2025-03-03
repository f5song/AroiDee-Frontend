// lib/recipes/utils.ts
import { Recipe } from "./types";
import { TAG_COLORS, TAG_DISPLAY } from "./constants";

/**
 * เรียงลำดับสูตรอาหารตามตัวเลือกที่ระบุ
 */
export const sortRecipes = (recipes: Recipe[], sortOption: string): Recipe[] => {
  const recipesCopy = [...recipes];
  
  switch (sortOption) {
    case "latest":
      return recipesCopy.sort((a, b) => b.id - a.id);
    case "oldest":
      return recipesCopy.sort((a, b) => a.id - b.id);
    case "name-asc":
      return recipesCopy.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return recipesCopy.sort((a, b) => b.title.localeCompare(a.title));
    case "rating":
      return recipesCopy.sort((a, b) => b.rating - a.rating);
    case "cooking-time":
      return recipesCopy.sort((a, b) => a.time - b.time);
    case "calories-low":
      return recipesCopy.sort((a, b) => a.calories - b.calories);
    case "calories-high":
      return recipesCopy.sort((a, b) => b.calories - a.calories);
    default:
      return recipesCopy;
  }
};

/**
 * กรองสูตรอาหารตามเงื่อนไขหลายอย่าง
 */
export const filterRecipes = (
  recipes: Recipe[], 
  categories: string[] = [],
  search: string = "",
  cookingTime?: number,
  difficulty?: string,
  calorieRange?: number
): Recipe[] => {
  
  let filtered = [...recipes];
  
  // กรองตามหมวดหมู่
  if (categories.length > 0) {
    filtered = filtered.filter(recipe => 
      categories.some(category => recipe.tags.includes(category))
    );
  }
  
  // กรองตามคำค้นหา
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(recipe => 
      recipe.title.toLowerCase().includes(searchLower) ||
      recipe.tags.some(tag => TAG_DISPLAY[tag]?.toLowerCase().includes(searchLower) || tag.toLowerCase().includes(searchLower))
    );
  }
  
  // กรองตามเวลาทำอาหาร
  if (cookingTime) {
    filtered = filtered.filter(recipe => recipe.time <= cookingTime);
  }
  
  // กรองตามความยาก
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter(recipe => recipe.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  
  // กรองตามช่วงแคลอรี่
  if (calorieRange) {
    filtered = filtered.filter(recipe => recipe.calories <= calorieRange);
  }
  
  return filtered;
};

/**
 * ดึงสีของแท็กตามชื่อแท็ก
 */
export const getTagColor = (tag: string): string => {
  return TAG_COLORS[tag] || "bg-gray-100 text-gray-800";
};

/**
 * แปลงเวลาในนาทีเป็นรูปแบบที่อ่านง่าย
 */
export const formatCookingTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} นาที`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ชั่วโมง`;
  }
  
  return `${hours} ชั่วโมง ${remainingMinutes} นาที`;
};

/**
 * แปลงแท็กเป็นชื่อที่แสดงผล
 */
export const getTagDisplayName = (tag: string): string => {
  return TAG_DISPLAY[tag] || tag;
};

/**
 * จัดรูปแบบจำนวนแคลอรี่
 */
export const formatCalories = (calories: number): string => {
  return `${calories} แคลอรี่`;
};

/**
 * ดึงระดับความยากในภาษาไทย
 */
export const getDifficultyDisplay = (difficulty: string): string => {
  return TAG_DISPLAY[difficulty.toLowerCase()] || difficulty;
};

/**
 * ดึงแท็กที่ไม่ซ้ำกันจากสูตรอาหาร
 */
export const extractUniqueTags = (recipes: Recipe[]): string[] => {
  const allTags = recipes.flatMap(recipe => recipe.tags);
  return [...new Set(allTags)];
};

/**
 * ดึงรายการโปรดจาก localStorage
 */
export const getFavoriteIds = (): number[] => {
  try {
    const savedFavorites = localStorage.getItem("favoriteRecipes");
    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
  }
  
  return [];
};

/**
 * บันทึกรายการโปรดลง localStorage
 */
export const saveFavoriteIds = (ids: number[]): boolean => {
  try {
    localStorage.setItem("favoriteRecipes", JSON.stringify(ids));
    return true;
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
    return false;
  }
};

/**
 * แบ่งหน้าข้อมูล
 */
export const paginateData = <T>(
  data: T[], 
  page: number, 
  itemsPerPage: number
): { items: T[], total: number, totalPages: number } => {
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = data.slice(startIndex, startIndex + itemsPerPage);
  
  return {
    items: paginatedItems,
    total: data.length,
    totalPages: Math.ceil(data.length / itemsPerPage)
  };
};

/**
 * Get category options formatted for dropdown
 */
export const getCategoryOptions = () => {
  // Get categories from sidebar/constants or constants.ts
  const categories = [
    { slug: 'thai', name: 'Thai Food', icon: '🇹🇭' },
    { slug: 'italian', name: 'Italian', icon: '🇮🇹' },
    { slug: 'mexican', name: 'Mexican', icon: '🇲🇽' },
    { slug: 'vegetarian', name: 'Vegetarian', icon: '🥗' },
    { slug: 'breakfast', name: 'Breakfast', icon: '🍳' },
    { slug: 'dinner', name: 'Dinner', icon: '🍽️' },
    { slug: 'dessert', name: 'Dessert', icon: '🍰' },
    { slug: 'healthy', name: 'Healthy', icon: '💪' },
    { slug: 'quick-meals', name: 'Quick Meals', icon: '⏱️' },
    { slug: 'chicken', name: 'Chicken', icon: '🍗' },
    { slug: 'beef', name: 'Beef', icon: '🥩' },
    { slug: 'seafood', name: 'Seafood', icon: '🐟' },
    { slug: 'pasta', name: 'Pasta', icon: '🍝' },
    { slug: 'soup', name: 'Soup', icon: '🍲' },
    { slug: 'salad', name: 'Salad', icon: '🥗' },
    { slug: 'spicy', name: 'Spicy', icon: '🌶️' },
    { slug: 'gluten-free', name: 'Gluten-Free', icon: '🌾' },
    { slug: 'vegan', name: 'Vegan', icon: '🌱' },
  ];

  // Return formatted for dropdown
  return categories.map(cat => ({
    value: cat.slug,
    label: cat.name,
    icon: cat.icon
  }));
};

/**
 * Format recipe data for display
 * 
 * This can be used to format the recipe for display in the UI,
 * such as converting tags to display names, etc.
 */
export const formatRecipeForDisplay = (recipe: any) => {
  return {
    ...recipe,
    // Add any transformations needed
  };
};

/**
 * Generate placeholder recipe image URL
 */
export const getPlaceholderRecipeImage = (seed: string = 'recipe') => {
  return `https://source.unsplash.com/300x300/?food,${seed}`;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `Image size exceeds 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`
    };
  }

  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPG, PNG and WebP images are accepted.'
    };
  }

  return { valid: true };
};