// lib/recipes/constants.ts
import { SortOption, TagColorMap, CategoryMap, CategoryOption } from "./types";

// ค่าคงที่ทั่วไป
export const RECIPES_PER_PAGE = 8;

// ตัวเลือกการเรียงลำดับ (แบบ object)
export const SORT_OPTIONS = {
  LATEST: "latest",
  OLDEST: "oldest",
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
  COOKING_TIME: "cooking-time",
  RATING: "rating",
  CALORIES_LOW: "calories-low",
  CALORIES_HIGH: "calories-high",
};

// ตัวเลือกการเรียงลำดับ (แบบ array สำหรับ dropdown)
export const SORT_OPTIONS_LIST: SortOption[] = [
  { value: "latest", label: "ล่าสุด" },
  { value: "oldest", label: "เก่าสุด" },
  { value: "rating", label: "คะแนนสูงสุด" },
  { value: "cooking-time", label: "เวลาทำอาหารน้อยสุด" },
  { value: "name-asc", label: "ชื่อ (ก-ฮ)" },
  { value: "name-desc", label: "ชื่อ (ฮ-ก)" },
  { value: "calories-low", label: "แคลอรี่น้อยสุด" },
  { value: "calories-high", label: "แคลอรี่มากสุด" },
];

// ค่าแท็บ
export const TAB_VALUES = {
  MY_RECIPES: "my-recipes",
  FAVORITES: "favorites",
  ALL_RECIPES: "all-recipes",
};

// ค่าความยาก
export const DIFFICULTY_OPTIONS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  ALL: "all",
};

// ตัวเลือกเวลาทำอาหาร
export const COOKING_TIME_OPTIONS = [15, 30, 45, 60];

// ค่าเริ่มต้นสำหรับตัวกรอง
export const DEFAULT_FILTER_OPTIONS = {
  page: 1,
  sort: "latest"
};

// สีของแท็ก
export const TAG_COLORS: TagColorMap = {
  "thai": "bg-red-100 text-red-800",
  "italian": "bg-green-100 text-green-800",
  "mexican": "bg-yellow-100 text-yellow-800",
  "asian": "bg-orange-100 text-orange-800",
  "vegetarian": "bg-emerald-100 text-emerald-800",
  "vegan": "bg-teal-100 text-teal-800",
  "dessert": "bg-pink-100 text-pink-800",
  "breakfast": "bg-blue-100 text-blue-800",
  "dinner": "bg-indigo-100 text-indigo-800",
  "quick-meals": "bg-purple-100 text-purple-800",
  "spicy": "bg-rose-100 text-rose-800",
  "healthy": "bg-lime-100 text-lime-800",
  "gluten-free": "bg-amber-100 text-amber-800",
  "keto": "bg-sky-100 text-sky-800",
  "salad": "bg-green-100 text-green-800",
  "soup": "bg-blue-100 text-blue-800",
  "easy": "bg-emerald-100 text-emerald-800",
  "medium": "bg-amber-100 text-amber-800",
  "hard": "bg-red-100 text-red-800",
};

// หมวดหมู่อาหารทั้งหมด
export const CATEGORIES: CategoryOption[] = [
  // ประเภทอาหาร/ภูมิภาค
  { id: "thai", name: "อาหารไทย", group: "cuisine" },
  { id: "italian", name: "อาหารอิตาเลียน", group: "cuisine" },
  { id: "mexican", name: "อาหารเม็กซิกัน", group: "cuisine" },
  { id: "asian", name: "อาหารเอเชีย", group: "cuisine" },
  
  // ประเภทมื้ออาหาร
  { id: "breakfast", name: "อาหารเช้า", group: "meal" },
  { id: "lunch", name: "อาหารกลางวัน", group: "meal" },
  { id: "dinner", name: "อาหารเย็น", group: "meal" },
  { id: "dessert", name: "ของหวาน", group: "meal" },
  
  // ประเภทโภชนาการ
  { id: "vegetarian", name: "มังสวิรัติ", group: "diet" },
  { id: "vegan", name: "วีแกน", group: "diet" },
  { id: "gluten-free", name: "ไร้กลูเตน", group: "diet" },
  { id: "keto", name: "คีโต", group: "diet" },
  { id: "healthy", name: "อาหารเพื่อสุขภาพ", group: "diet" },
  
  // ประเภทวัตถุดิบหลัก
  { id: "chicken", name: "ไก่", group: "ingredient" },
  { id: "beef", name: "เนื้อวัว", group: "ingredient" },
  { id: "seafood", name: "อาหารทะเล", group: "ingredient" },
  { id: "eggs", name: "ไข่", group: "ingredient" },
  { id: "rice", name: "ข้าว", group: "ingredient" },
  { id: "noodles", name: "เส้น", group: "ingredient" },
  { id: "pasta", name: "พาสต้า", group: "ingredient" },
  
  // ประเภทรสชาติ
  { id: "spicy", name: "เผ็ด", group: "taste" },
  { id: "sweet", name: "หวาน", group: "taste" },
  
  // ประเภทเวลา
  { id: "quick-meals", name: "อาหารทำเร็ว", group: "time" },
  
  // ประเภทอาหาร
  { id: "soup", name: "ซุป", group: "type" },
  { id: "salad", name: "สลัด", group: "type" },
  { id: "pizza", name: "พิซซ่า", group: "type" },
  { id: "baking", name: "เบเกอรี่", group: "type" },
  { id: "beverage", name: "เครื่องดื่ม", group: "type" },
];

// กลุ่มหมวดหมู่
export const CATEGORY_GROUPS = {
  CUISINE: "cuisine",
  MEAL: "meal",
  DIET: "diet",
  INGREDIENT: "ingredient",
  TASTE: "taste",
  TIME: "time",
  TYPE: "type"
};

// แปลงแท็กเป็นชื่อไทย
export const TAG_DISPLAY: Record<string, string> = {
  "thai": "อาหารไทย",
  "italian": "อาหารอิตาเลียน",
  "mexican": "อาหารเม็กซิกัน",
  "asian": "อาหารเอเชีย",
  "vegetarian": "มังสวิรัติ",
  "vegan": "วีแกน",
  "breakfast": "อาหารเช้า",
  "lunch": "อาหารกลางวัน",
  "dinner": "อาหารเย็น",
  "dessert": "ของหวาน",
  "quick-meals": "อาหารทำเร็ว",
  "spicy": "เผ็ด",
  "chicken": "ไก่",
  "beef": "เนื้อวัว",
  "seafood": "อาหารทะเล",
  "gluten-free": "ไร้กลูเตน",
  "keto": "คีโต",
  "healthy": "อาหารเพื่อสุขภาพ",
  "easy": "ง่าย",
  "medium": "ปานกลาง",
  "hard": "ยาก",
  "noodles": "เส้น",
  "rice": "ข้าว",
  "soup": "ซุป",
  "pasta": "พาสต้า",
  "pizza": "พิซซ่า",
  "eggs": "ไข่",
  "sweet": "หวาน",
  "baking": "เบเกอรี่",
  "salad": "สลัด",
  "beverage": "เครื่องดื่ม",
};

// แปลงหมวดหมู่สำหรับ API เก่า
export const CATEGORY_MAPPING: CategoryMap = {
  thai: "Thai Food",
  healthy: "Healthy Food",
  vegetarian: "Vegetarian",
  seafood: "Seafood",
  dessert: "Dessert",
  drinks: "Beverage",
};

// ค่าเริ่มต้นสำหรับสูตรอาหารใหม่
export const DEFAULT_RECIPE = {
  title: "",
  description: "",
  calories: 0,
  time: 30,
  difficulty: DIFFICULTY_OPTIONS.MEDIUM,
  tags: []
};

// key สำหรับ local storage
export const STORAGE_KEYS = {
  FAVORITES: "favoriteRecipes",
  RECENT_SEARCHES: "recentSearches",
  USER_PREFERENCES: "userPreferences",
  SAVED_RECIPES: "savedRecipes",
  VIEWED_RECIPES: "viewedRecipes",
  DRAFT_RECIPES: "draftRecipes"
};

// ข้อความสถานะ
export const STATUS_MESSAGES = {
  LOADING: "กำลังโหลด...",
  NO_RESULTS: "ไม่พบสูตรอาหาร",
  ERROR: "เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง",
  SUCCESS: "ดำเนินการสำเร็จ",
  FAVORITE_ADDED: "เพิ่มในรายการโปรดแล้ว",
  FAVORITE_REMOVED: "ลบออกจากรายการโปรดแล้ว"
};

// ค่าพื้นฐานต่างๆ
export const APP_CONFIG = {
  MAX_TAGS_PER_RECIPE: 10,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_INGREDIENT_LENGTH: 100,
  MIN_COOKING_TIME: 1,
  MAX_COOKING_TIME: 1440, // 24 ชั่วโมง
  MIN_CALORIES: 0,
  MAX_CALORIES: 5000,
  DEFAULT_PAGE_SIZE: RECIPES_PER_PAGE,
  IMAGE_UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/jpg"]
};