// lib/recipes/recipe-validation.ts
import { RecipeInput, IngredientInput, InstructionInput, ValidationErrors } from "@/lib/recipes/form/types";
import { VALIDATION_LIMITS } from "@/lib/recipes/form/constants";

/**
 * Validates a recipe form input
 */
export const validateRecipe = (recipe: RecipeInput): ValidationErrors => {
  const errors: ValidationErrors = {};
  const {
    TITLE_MIN_LENGTH,
    TITLE_MAX_LENGTH,
    DESCRIPTION_MIN_LENGTH,
    MAX_COOKING_TIME,
    MAX_CALORIES,
    MAX_SERVINGS
  } = VALIDATION_LIMITS;
  
  // Title validation
  if (!recipe.title.trim()) {
    errors.title = "Recipe title is required";
  } else if (recipe.title.trim().length < TITLE_MIN_LENGTH) {
    errors.title = `Title must be at least ${TITLE_MIN_LENGTH} characters`;
  } else if (recipe.title.trim().length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be less than ${TITLE_MAX_LENGTH} characters`;
  }
  
  // Description validation
  if (!recipe.description.trim()) {
    errors.description = "Description is required";
  } else if (recipe.description.trim().length < DESCRIPTION_MIN_LENGTH) {
    errors.description = `Description must be at least ${DESCRIPTION_MIN_LENGTH} characters`;
  }
  
  // Cooking time validation
  if (recipe.time <= 0) {
    errors.cookingTime = "Cooking time must be greater than 0";
  } else if (recipe.time > MAX_COOKING_TIME) {
    errors.cookingTime = `Cooking time cannot exceed 24 hours (${MAX_COOKING_TIME} minutes)`;
  }
  
  // Calories validation
  if (recipe.calories <= 0) {
    errors.calories = "Calories must be greater than 0";
  } else if (recipe.calories > MAX_CALORIES) {
    errors.calories = "Calories seem too high, please check";
  }
  
  // Servings validation
  if (recipe.servings <= 0) {
    errors.servings = "Servings must be greater than 0";
  } else if (recipe.servings > MAX_SERVINGS) {
    errors.servings = "Servings seem too high, please check";
  }
  
  // Ingredients validation
  const validIngredients = recipe.ingredients.filter(ing => ing.name.trim() && ing.amount.trim());
  if (validIngredients.length === 0) {
    errors.ingredients = "At least one ingredient with name and amount is required";
  }
  
  // Instructions validation
  const validInstructions = recipe.instructions.filter(inst => inst.text.trim());
  if (validInstructions.length === 0) {
    errors.instructions = "At least one instruction step is required";
  }
  
  return errors;
};

/**
 * Check if a specific ingredient is valid
 */
export const isIngredientValid = (ingredient: IngredientInput): boolean => {
  return !!ingredient.name.trim() && !!ingredient.amount.trim();
};

/**
 * Check if a specific instruction is valid
 */
export const isInstructionValid = (instruction: InstructionInput): boolean => {
  return instruction.text.trim().length > 0;
};

/**
 * Format error messages for display
 */
export const formatErrorMessage = (error: string): string => {
  return error.charAt(0).toUpperCase() + error.slice(1);
};

/**
 * Find which tab contains errors
 */
export const findErrorTab = (errors: ValidationErrors): string => {
  if (errors.title || errors.description || 
      errors.cookingTime || errors.calories || 
      errors.servings) {
    return "basic";
  } else if (errors.ingredients) {
    return "ingredients";
  } else if (errors.instructions) {
    return "instructions";
  }
  return "basic";
};