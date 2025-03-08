// lib/recipes/form/types.ts
import { Recipe } from "../types";

/**
 * Input types for ingredient form
 */
export interface IngredientInput {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

/**
 * Input types for instruction step form
 */
export interface InstructionInput {
  id: number;
  text: string;
}

/**
 * Input data for creating/editing a recipe
 */
export interface RecipeInput {
  title: string;
  description: string;
  cook_time: number;
  calories: number;
  difficulty: string;
  servings: number;
  image_url: string | null;
  tags: string[];
  ingredients: IngredientInput[];
  instructions: InstructionInput[];
}

/**
 * Response type for recipe creation API
 */
export interface CreateRecipeResponse {
  success: boolean;
  id?: number;
  error?: string;
}

/**
 * Validation errors interface
 */
export interface ValidationErrors {
  title?: string;
  description?: string;
  cookingTime?: string;
  calories?: string;
  servings?: string;
  ingredients?: string;
  instructions?: string;
  submit?: string;
  [key: string]: string | undefined;
}

/**
 * Dropdown option interface
 */
export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

/**
 * Convert Recipe Input to Recipe for API
 */
export const recipeInputToRecipe = (input: RecipeInput): Partial<Recipe> => {
  return {
    title: input.title,
    description: input.description,
    cook_time: input.cook_time, // ✅ แก้จาก input.time เป็น input.cook_time
    calories: input.calories,
    difficulty: input.difficulty,
    image_url: input.image_url || "/placeholder.svg",
    categories: input.tags.map(tag => ({
      id: 0, // ✅ ตั้งค่า default ID
      name: tag, // ✅ ใช้ชื่อ category จาก tag
      image_url: "" // ✅ กำหนดค่า default ให้ image_url
    })), // ✅ แปลง string[] เป็น Category[]
    rating: 0 // New recipe starts with 0 rating
  };
};
