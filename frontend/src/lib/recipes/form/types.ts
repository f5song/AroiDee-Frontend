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
  time: number;
  calories: number;
  difficulty: string;
  servings: number;
  image: string | null;
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
    time: input.time,
    calories: input.calories,
    difficulty: input.difficulty,
    image: input.image || "/placeholder.svg",
    tags: input.tags,
    rating: 0 // New recipe starts with 0 rating
  };
};