// lib/recipes/form/constants.ts
import { IngredientInput, InstructionInput, RecipeInput, SelectOption } from "./types";
import { DIFFICULTY_OPTIONS } from "../constants";

/**
 * Default values for ingredient form
 */
export const DEFAULT_INGREDIENT: IngredientInput = {
  id: 1,
  name: "",
  amount: "",
  unit: ""
};

/**
 * Default values for instruction step form
 */
export const DEFAULT_INSTRUCTION: InstructionInput = {
  id: 1,
  text: ""
};

/**
 * Default values for recipe form
 */
export const DEFAULT_RECIPE_FORM: RecipeInput = {
  title: "",
  description: "",
  time: 30,
  calories: 300,
  difficulty: DIFFICULTY_OPTIONS.MEDIUM,
  servings: 4,
  image: null,
  tags: [],
  ingredients: [DEFAULT_INGREDIENT],
  instructions: [DEFAULT_INSTRUCTION]
};

/**
 * Options for ingredient units
 */
export const UNIT_OPTIONS: SelectOption[] = [
  { value: "", label: "None" },
  { value: "g", label: "grams (g)" },
  { value: "kg", label: "kilograms (kg)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "l", label: "liters (l)" },
  { value: "tsp", label: "teaspoon (tsp)" },
  { value: "tbsp", label: "tablespoon (tbsp)" },
  { value: "cup", label: "cup" },
  { value: "pinch", label: "pinch" },
  { value: "piece", label: "piece" },
  { value: "slice", label: "slice" },
  { value: "clove", label: "clove" },
  { value: "bunch", label: "bunch" },
  { value: "oz", label: "ounce (oz)" },
  { value: "lb", label: "pound (lb)" }
];

/**
 * Difficulty options for dropdown
 */
export const DIFFICULTY_OPTIONS_LIST: SelectOption[] = [
  { value: DIFFICULTY_OPTIONS.EASY, label: "Easy" },
  { value: DIFFICULTY_OPTIONS.MEDIUM, label: "Medium" },
  { value: DIFFICULTY_OPTIONS.HARD, label: "Hard" }
];

/**
 * Cooking time presets
 */
export const TIME_PRESETS = [5, 10, 15, 30, 45, 60, 90, 120, 150, 180];

/**
 * Calorie presets
 */
export const CALORIE_PRESETS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

/**
 * Servings presets
 */
export const SERVINGS_PRESETS = [1, 2, 4, 6, 8, 10, 12];

/**
 * Form validation limits
 */
export const VALIDATION_LIMITS = {
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MIN_LENGTH: 10,
  MAX_COOKING_TIME: 1440, // 24 hours in minutes
  MAX_CALORIES: 5000,
  MAX_SERVINGS: 100
};

/**
 * Form tab values
 */
export const FORM_TABS = {
  BASIC: "basic",
  INGREDIENTS: "ingredients",
  INSTRUCTIONS: "instructions"
};

/**
 * Image upload configuration
 */
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  RECOMMENDED_DIMENSIONS: "500x500px",
  ACCEPTED_TYPES: "image/*"
};