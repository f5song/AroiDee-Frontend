// lib/recipes/mock-data.ts
import { Recipe } from './types';

/**
 * ข้อมูลสูตรอาหารจำลอง (สูตรอาหารทั่วไป)
 */
export const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    description: "Test",
    title: "ผัดกระเพราไก่",
    calories: 380,
    cook_time: 25,
    image: "/images/recipes/thai-basil-chicken.jpg",
    rating: 4.8,
    difficulty: "medium",
    categories: ["thai", "spicy", "chicken", "quick-meals"]
  },
  {
    id: 2,
    description: "Test",
    title: "พิซซ่ามาร์เกริต้า",
    calories: 450,
    cook_time: 35,
    image: "/images/recipes/margherita-pizza.jpg",
    rating: 4.5,
    difficulty: "easy",
    categories: ["italian", "vegetarian", "pizza"]
  },
  {
    id: 3,
    description: "Test",
    title: "ทาโก้เนื้อซอสซัลซ่า",
    calories: 320,
    cook_time: 30,
    image: "/images/recipes/beef-tacos.jpg",
    rating: 4.7,
    difficulty: "easy",
    categories: ["mexican", "beef", "quick-meals"]
  },
  {
    id: 4,
    description: "Test",
    title: "แกงกะหรี่ผัก",
    calories: 280,
    cook_time: 40,
    image: "/images/recipes/vegetable-curry.jpg",
    rating: 4.6,
    difficulty: "medium",
    categories: ["vegan", "curry", "gluten-free", "healthy"]
  },
  {
    id: 5,
    description: "Test",
    title: "ริซอตโต้เห็ด",
    calories: 420,
    cook_time: 45,
    image: "/images/recipes/mushroom-risotto.jpg",
    rating: 4.4,
    difficulty: "medium",
    categories: ["italian", "vegetarian", "dinner"]
  },
  {
    id: 6,
    description: "Test",
    title: "ขนมปังอะโวคาโด",
    calories: 220,
    cook_time: 10,
    image: "/images/recipes/avocado-toast.jpg",
    rating: 4.3,
    difficulty: "easy",
    categories: ["breakfast", "vegetarian", "quick-meals", "healthy"]
  },
  {
    id: 7,
    description: "Test",
    title: "ปลาแซลมอนย่างเนยมะนาว",
    calories: 350,
    cook_time: 20,
    image: "/images/recipes/grilled-salmon.jpg",
    rating: 4.9,
    difficulty: "medium",
    categories: ["seafood", "keto", "dinner", "healthy"]
  },
  {
    id: 8,
    description: "Test",
    title: "คุกกี้ช็อคโกแลตชิพ",
    calories: 180,
    cook_time: 30,
    image: "/images/recipes/chocolate-cookies.jpg",
    rating: 4.7,
    difficulty: "easy",
    categories: ["dessert", "sweet", "baking"]
  },
  {
    id: 9,
    description: "Test",
    title: "สลัดซีซาร์ไก่",
    calories: 290,
    cook_time: 15,
    image: "/images/recipes/caesar-salad.jpg",
    rating: 4.2,
    difficulty: "easy",
    categories: ["salad", "chicken", "lunch", "healthy"]
  },
  {
    id: 10,
    description: "Test",
    title: "เนื้อผัดบร็อคโคลี่",
    calories: 340,
    cook_time: 20,
    image: "/images/recipes/beef-broccoli.jpg",
    rating: 4.5,
    difficulty: "medium",
    categories: ["asian", "beef", "quick-meals"]
  },
  {
    id: 11,
    description: "Test",
    title: "ต้มยำกุ้ง",
    calories: 200,
    cook_time: 35,
    image: "/images/recipes/tom-yum.jpg",
    rating: 4.9,
    difficulty: "medium",
    categories: ["thai", "seafood", "spicy", "soup"]
  },
  {
    id: 12,
    description: "Test",
    title: "ข้าวผัดสับปะรด",
    calories: 420,
    cook_time: 25,
    image: "/images/recipes/pineapple-rice.jpg",
    rating: 4.3,
    difficulty: "easy",
    categories: ["thai", "rice", "quick-meals"]
  },
  {
    id: 13,
    description: "Test",
    title: "ส้มตำไทย",
    calories: 150,
    cook_time: 15,
    image: "/images/recipes/som-tam.jpg",
    rating: 4.7,
    difficulty: "easy",
    categories: ["thai", "spicy", "healthy", "salad"]
  },
  {
    id: 14,
    description: "Test",
    title: "ลาบเห็ด",
    calories: 180,
    cook_time: 20,
    image: "/images/recipes/mushroom-larb.jpg",
    rating: 4.4,
    difficulty: "easy",
    categories: ["thai", "vegetarian", "spicy"]
  },
  {
    id: 15,
    description: "Test",
    title: "ชาไทยมะพร้าว",
    calories: 220,
    cook_time: 10,
    image: "/images/recipes/thai-tea.jpg",
    rating: 4.6,
    difficulty: "easy",
    categories: ["beverage", "sweet", "thai"]
  }
];

/**
 * ข้อมูลจำลองสูตรอาหารของผู้ใช้
 */
export const MOCK_USER_RECIPES: Recipe[] = [
  {
    id: 101,
    description: "Test",
    title: "สปาเกตตี้ซอสเนื้อโฮมเมด",
    calories: 450,
    cook_time: 40,
    image: "/images/recipes/spaghetti-bolognese.jpg",
    rating: 4.8,
    difficulty: "medium",
    categories: ["italian", "pasta", "dinner", "beef"]
  },
  {
    id: 102,
    description: "Test",
    title: "ซุปไก่ใส่เส้น",
    calories: 320,
    cook_time: 50,
    image: "/images/recipes/chicken-soup.jpg",
    rating: 4.6,
    difficulty: "medium",
    categories: ["soup", "chicken", "comfort-food"]
  },
  {
    id: 103,
    description: "Test",
    title: "ออมเลตเช้าเร็วทันใจ",
    calories: 280,
    cook_time: 15,
    image: "/images/recipes/omelette.jpg",
    rating: 4.3,
    difficulty: "easy",
    categories: ["breakfast", "eggs", "quick-meals"]
  }
];

/**
 * ค่าเริ่มต้นสำหรับรายการสูตรอาหารโปรด
 */
export const DEFAULT_FAVORITE_IDS = [2, 4, 7, 11, 13];

/**
 * ดึงรายการสูตรอาหารทั้งหมด
 */
export const getAllRecipes = (): Recipe[] => {
  return [...MOCK_RECIPES, ...MOCK_USER_RECIPES];
};