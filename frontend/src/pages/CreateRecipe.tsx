import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { BasicInfoSection } from "@/components/createRecipe/BasicInfoSection";
import { IngredientsSection } from "@/components/createRecipe/IngredientsSection";
import { InstructionsSection } from "@/components/createRecipe/InstructionsSection";
import { FormActions } from "@/components/createRecipe/FormActions";
import { createRecipe } from "@/lib/api/recipeApi"; // ✅ Import API Call
import { useAuth } from "@/components/auth/AuthContext";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth(); // ✅ ดึง Token และ User ID
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // ✅ ตั้งค่า Recipe State
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    instructions: [{ step: "" }],
    image_url: "",
    cook_time: 0,
    category_id: null,
    recipe_ingredients: [],
  });

  const [tagInput, setTagInput] = useState("");

  const updateBasicInfo = (field: string, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (imageUrl: string) => {
    setRecipe((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleCategorySelect = (categoryName: string) => {
    setRecipe((prev) => ({ ...prev, category_id: categoryName }));
  };

  const addTag = (tag: any) => {
    setRecipe((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), tag],
    }));
  };

  const removeTag = (tagName: string) => {
    setRecipe((prev) => ({
      ...prev,
      categories: prev.categories.filter((tag: any) => tag.name !== tagName),
    }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      recipe_ingredients: [...prev.recipe_ingredients, { ingredient_id: "", quantity: "" }],
    }));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updatedIngredients = [...recipe.recipe_ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setRecipe((prev) => ({ ...prev, recipe_ingredients: updatedIngredients }));
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = recipe.recipe_ingredients.filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, recipe_ingredients: updatedIngredients }));
  };

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, { step: "" }],
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions[index] = { step: value };
    setRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const removeInstruction = (index: number) => {
    const updatedInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!token || !user) {
      alert("You must be logged in to create a recipe");
      return;
    }

    // ✅ แปลง instructions เป็น JSON
    const formattedRecipe = {
      ...recipe,
      user_id: user.id, // ✅ เพิ่ม user_id
      instructions: JSON.stringify(recipe.instructions),
    };

    try {
      const result = await createRecipe(formattedRecipe, token);

      if (result.success) {
        navigate("/my-recipes");
      } else {
        setErrors({ submit: result.error || "Failed to create recipe" });
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <RecipeHeader title="Create New Recipe" subtitle="Share your culinary creations with the world" />

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
              handleCategorySelect={handleCategorySelect}
            />

            <IngredientsSection
              ingredients={recipe.recipe_ingredients}
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
            />

            <FormActions isSaving={isSaving} onCancel={() => navigate("/my-recipes")} />
          </div>
        </form>

        {errors.submit && <p className="text-red-500 text-center mt-4">{errors.submit}</p>}
      </div>
    </div>
  );
}
