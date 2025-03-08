// lib/recipes/create-recipe-types.ts
import { Recipe } from "@/lib/recipes";
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
  categories: string[];
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
    categories: input.categories.map(cat => ({
      id: 0, // Assign default ID for new categories
      name: cat, // Keep category name from input
      image_url: "" // Default image URL
    })), // ✅ แปลง string[] เป็น Category[]
    rating: 0, // New recipe starts with 0 rating
  };
};
