// lib/recipes/recipe-form-api.ts
import { RecipeInput, CreateRecipeResponse, recipeInputToRecipe } from "@/lib/recipes/form/types";
import { Recipe } from "@/lib/recipes/types";

/**
 * Saves a new recipe
 */
export const createRecipe = async (recipeInput: RecipeInput): Promise<CreateRecipeResponse> => {
  try {
    // In a real app, this would be a call to your API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Convert RecipeInput to the format expected by the API
    const recipeData = recipeInputToRecipe(recipeInput);
    
    // Simulate successful save
    const response: CreateRecipeResponse = {
      success: true,
      id: Math.floor(Math.random() * 1000) + 100 // Generate a fake ID
    };
    
    console.log("Recipe data to be sent:", recipeData);
    
    return response;
  } catch (error) {
    console.error("Error creating recipe:", error);
    return {
      success: false,
      error: "Failed to save recipe. Please try again."
    };
  }
};

/**
 * Updates an existing recipe
 */
export const updateRecipe = async (id: number, recipeInput: RecipeInput): Promise<CreateRecipeResponse> => {
  try {
    // In a real app, this would be a call to your API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Convert RecipeInput to the format expected by the API
    const recipeData = recipeInputToRecipe(recipeInput);
    
    // Simulate successful update
    const response: CreateRecipeResponse = {
      success: true,
      id: id
    };
    
    console.log(`Recipe ${id} data to be updated:`, recipeData);
    
    return response;
  } catch (error) {
    console.error("Error updating recipe:", error);
    return {
      success: false,
      error: "Failed to update recipe. Please try again."
    };
  }
};

/**
 * Uploads a recipe image to the server
 */
export const uploadRecipeImage = async (imageFile: File): Promise<{url: string} | {error: string}> => {
  try {
    // In a real app, this would be a call to your API to upload the image
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Simulate successful upload
    return {
      url: URL.createObjectURL(imageFile) // This just creates a temporary local URL
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      error: "Failed to upload image. Please try again."
    };
  }
};

/**
 * Fetches a recipe for editing
 */
export const fetchRecipeForEdit = async (id: number): Promise<RecipeInput | null> => {
  try {
    // In a real app, this would be a call to your API
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    // Simulate recipe fetch
    // You would convert the API response to RecipeInput format here
    return null;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
};