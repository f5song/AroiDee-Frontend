import React from "react";
import { useNavigate } from "react-router-dom";

// Refactored components
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { BasicInfoSection } from "@/components/createRecipe/BasicInfoSection";
import { IngredientsSection } from "@/components/createRecipe/IngredientsSection";
import { InstructionsSection } from "@/components/createRecipe/InstructionsSection";
import { FormActions } from "@/components/createRecipe/FormActions";

import { Category } from "../lib/recipes/types"; // ✅ เพิ่ม Category


// Import from refactored files
import { useRecipeForm } from "@/lib/recipes/form";
import { createRecipe } from "@/lib/recipes/form/api";

/**
 * Create New Recipe page component
 */
export default function CreateRecipeSinglePage() {
  const navigate = useNavigate();
  
  // Use the recipe form hook
  const {
    recipe,
    errors,
    isSaving,
    setIsSaving,
    tagInput,
    setTagInput,
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
  } = useRecipeForm();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Start saving process
    setIsSaving(true);
    
    try {
      // Save recipe using the updated API
      const result = await createRecipe(recipe);
      
      if (result.success) {
        // Navigate to the recipe page or my recipes page
        navigate("/my-recipes");
      } else {
        // Show error
        updateBasicInfo('submit' as any, result.error || "Failed to save recipe");
      }
    } catch (error) {
      console.error("Error saving recipe create recipe:", error);
      updateBasicInfo('submit' as any, "An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  
  
  const handleCategorySelect = (categoryName: string) => {
    // ตรวจสอบว่าหมวดหมู่ที่เลือกมีอยู่แล้วหรือไม่
    const categoryExists = recipe.categories.some(cat => cat.name === categoryName);
  
    if (!categoryExists && categoryName !== "all") {
      addTag({ id: 0, name: categoryName, image_url: "" }); // ✅ ส่ง Category object แทน string
    }
  };
  
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        const newCategory: Category = { id: 0, name: tagInput.trim(), image_url: "" }; // ✅ แปลงเป็น Category
        addTag(newCategory); // ✅ ส่ง Category object แทน string
        setTagInput(""); // ✅ เคลียร์ input หลังเพิ่ม
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <RecipeHeader 
          title="🍳 Create New Recipe" 
          subtitle="Share your culinary creations with the world" 
        />

        <form onSubmit={handleSubmit}>
          <div className="space-y-10">
            <BasicInfoSection
              recipe={recipe}
              errors={errors}
              tagInput={tagInput}
              setTagInput={setTagInput}
              updateBasicInfo={updateBasicInfo}
              addTag={addTag}
              removeTag={removeTag}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              handleCategorySelect={handleCategorySelect}
              handleTagKeyDown={handleTagKeyDown}
            />

            <IngredientsSection 
              ingredients={recipe.ingredients}
              errors={errors}
              addIngredient={addIngredient}
              updateIngredient={updateIngredient}
              removeIngredient={removeIngredient}
            />

            <InstructionsSection
              instructions={recipe.instructions}
              errors={errors}
              addInstruction={addInstruction}
              updateInstruction={updateInstruction}
              removeInstruction={removeInstruction}
              moveInstruction={moveInstruction}
            />

            <FormActions 
              errors={errors}
              isSaving={isSaving}
              onCancel={() => navigate("/my-recipes")}
            />
          </div>
        </form>
      </div>
    </div>
  );
}