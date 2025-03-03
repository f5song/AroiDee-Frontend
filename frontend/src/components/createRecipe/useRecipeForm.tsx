// lib/recipes/use-recipe-form.ts
import { useState } from "react";
import { RecipeInput, IngredientInput, InstructionInput, ValidationErrors } from "@/lib/recipes/form/types";
import { DEFAULT_RECIPE_FORM } from "@/lib/recipes/form/constants";
import { validateRecipe, findErrorTab } from "@/lib/recipes/form/validation";

/**
 * Custom hook for managing recipe form state and logic
 */
export const useRecipeForm = () => {
  // Form state
  const [recipe, setRecipe] = useState<RecipeInput>({...DEFAULT_RECIPE_FORM});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Basic info handlers
  const updateBasicInfo = (field: keyof RecipeInput, value: any) => {
    setRecipe(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const updated = {...prev};
        delete updated[field];
        return updated;
      });
    }
  };
  
  // Tag handlers
  const addTag = (tag: string) => {
    if (tag.trim() && !recipe.tags.includes(tag.trim().toLowerCase())) {
      updateBasicInfo('tags', [...recipe.tags, tag.trim().toLowerCase()]);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    updateBasicInfo('tags', recipe.tags.filter(tag => tag !== tagToRemove));
  };
  
  // Ingredient handlers
  const addIngredient = () => {
    const newId = recipe.ingredients.length > 0 
      ? Math.max(...recipe.ingredients.map(i => i.id)) + 1 
      : 1;
      
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: newId, name: "", amount: "", unit: "" }]
    }));
    
    // Clear ingredients error if it exists
    if (errors.ingredients) {
      setErrors(prev => {
        const updated = {...prev};
        delete updated.ingredients;
        return updated;
      });
    }
  };
  
  const updateIngredient = (id: number, field: keyof IngredientInput, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ingredient => 
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    }));
    
    // Clear ingredients error if it exists
    if (errors.ingredients) {
      setErrors(prev => {
        const updated = {...prev};
        delete updated.ingredients;
        return updated;
      });
    }
  };
  
  const removeIngredient = (id: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(ingredient => ingredient.id !== id)
      }));
    }
  };
  
  // Instruction handlers
  const addInstruction = () => {
    const newId = recipe.instructions.length > 0 
      ? Math.max(...recipe.instructions.map(i => i.id)) + 1 
      : 1;
      
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, { id: newId, text: "" }]
    }));
    
    // Clear instructions error if it exists
    if (errors.instructions) {
      setErrors(prev => {
        const updated = {...prev};
        delete updated.instructions;
        return updated;
      });
    }
  };
  
  const updateInstruction = (id: number, text: string) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map(instruction => 
        instruction.id === id ? { ...instruction, text } : instruction
      )
    }));
    
    // Clear instructions error if it exists
    if (errors.instructions) {
      setErrors(prev => {
        const updated = {...prev};
        delete updated.instructions;
        return updated;
      });
    }
  };
  
  const removeInstruction = (id: number) => {
    if (recipe.instructions.length > 1) {
      setRecipe(prev => ({
        ...prev,
        instructions: prev.instructions.filter(instruction => instruction.id !== id)
      }));
    }
  };
  
  const moveInstruction = (id: number, direction: 'up' | 'down') => {
    const index = recipe.instructions.findIndex(instruction => instruction.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === recipe.instructions.length - 1)
    ) {
      return; // Can't move further up/down
    }
    
    const newInstructions = [...recipe.instructions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newInstructions[index], newInstructions[targetIndex]] = 
    [newInstructions[targetIndex], newInstructions[index]];
    
    setRecipe(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };
  
  // Image handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBasicInfo('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    updateBasicInfo('image', null);
    setImageFile(null);
  };
  
  // Form validation
  const validateForm = () => {
    const validationErrors = validateRecipe(recipe);
    setErrors(validationErrors);
    
    // Navigate to the tab with errors
    if (Object.keys(validationErrors).length > 0) {
      // Find which tab has errors
      const errorTab = findErrorTab(validationErrors);
      setActiveTab(errorTab);
      return false;
    }
    
    return true;
  };
  
  return {
    recipe,
    errors,
    activeTab,
    setActiveTab,
    isSaving,
    setIsSaving,
    tagInput,
    setTagInput,
    imageFile,
    updateBasicInfo,
    addTag,
    removeTag,
    addIngredient,
    updateIngredient,
    removeIngredient,
    addInstruction,
    updateInstruction,
    removeInstruction,
    moveInstruction,
    handleImageChange,
    removeImage,
    validateForm
  };
};

export default useRecipeForm;