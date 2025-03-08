// lib/recipes/form/types.ts
import { Recipe, Category } from "../types"; // ✅ เพิ่ม Category


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
  categories: Category[];  // ✅ เปลี่ยนจาก tags: string[] เป็น categories: Category[]
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
export type ValidationErrors = Record<string, string>; // ✅ แก้ไขให้เป็น Record<string, string>

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
    cook_time: input.cook_time,
    calories: input.calories,
    difficulty: input.difficulty,
    image_url: input.image_url || "/placeholder.svg",
    categories: input.categories.map(category => ({ // ✅ ใช้ input.categories แทน tags
      id: category.id, 
      name: category.name, 
      image_url: category.image_url
    })),
    rating: 0 // New recipe starts with 0 rating
  };
};

