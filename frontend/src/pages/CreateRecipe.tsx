import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { BasicInfoSection } from "@/components/createRecipe/BasicInfoSection";
import { IngredientsSection } from "@/components/createRecipe/IngredientsSection";
import { InstructionsSection } from "@/components/createRecipe/InstructionsSection";
import { FormActions } from "@/components/createRecipe/FormActions";
import { createRecipe } from "@/lib/api/recipeApi";
import { useAuth } from "@/components/auth/AuthContext";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ ตั้งค่า Recipe State
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    instructions: [{ id: 1, text: "" }],
    image_url: "",
    cook_time: 0,
    category_id: null as number | null,
    recipe_ingredients: [] as { ingredient_id: number; quantity: string }[],
    ingredients: [] as {
      id: number;
      name: string;
      amount: string;
      unit: string;
    }[], // ✅ เพิ่ม ingredients
    categories: [] as { id: number; name: string; image_url: string }[],
    calories: 0,
    difficulty: "",
    servings: 1,
  });

  const [tagInput, setTagInput] = useState("");

  const updateBasicInfo = (field: string, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setRecipe((prev) => ({ ...prev, image_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleCategorySelect = (categoryId: string) => {
    setRecipe((prev) => ({ ...prev, category_id: Number(categoryId) })); // ✅ แปลงเป็น number
  };

  const addTag = (tag: { id: number; name: string }) => {
    setRecipe((prev) => ({
      ...prev,
      categories: [...prev.categories, { ...tag, image_url: "" }],
    }));
  };

  const removeTag = (tagName: string) => {
    setRecipe((prev) => ({
      ...prev,
      categories: prev.categories.filter((tag) => tag.name !== tagName),
    }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      recipe_ingredients: [
        ...prev.recipe_ingredients,
        { ingredient_id: prev.recipe_ingredients.length + 1, quantity: "" }, // ✅ ใช้ `ingredient_id` เป็นตัวเลข
      ],
    }));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updatedIngredients = [...recipe.recipe_ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setRecipe((prev) => ({ ...prev, recipe_ingredients: updatedIngredients }));
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = recipe.recipe_ingredients.filter(
      (_, i) => i !== index
    );
    setRecipe((prev) => ({ ...prev, recipe_ingredients: updatedIngredients }));
  };

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { id: prev.instructions.length + 1, text: "" },
      ],
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...recipe.instructions];
    updatedInstructions[index] = { ...updatedInstructions[index], text: value };
    setRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const removeInstruction = (index: number) => {
    const updatedInstructions = recipe.instructions.filter(
      (_, i) => i !== index
    );
    setRecipe((prev) => ({ ...prev, instructions: updatedInstructions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!token || !user) {
      alert("You must be logged in to create a recipe");
      setIsSaving(false);
      return;
    }

    // ✅ แปลง instructions เป็น JSON ก่อนส่งไป backend
    const formattedRecipe = {
      ...recipe,
      user_id: user.id,
      instructions: JSON.stringify(
        recipe.instructions.map((step) => ({ id: step.id, text: step.text }))
      ),
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

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (tagInput.trim()) {
        const newCategory = {
          id: Date.now(),
          name: tagInput.trim(),
          image_url: "",
        }; // ✅ ใช้ Date.now() แทน id
        addTag(newCategory);
        setTagInput("");
      }
    }
  };

  const moveInstruction = (id: number, direction: "up" | "down") => {
    setRecipe((prev) => {
      const index = prev.instructions.findIndex((inst) => inst.id === id);
      if (index === -1) return prev; // ถ้าไม่เจอ id ให้ return state เดิม

      const newInstructions = [...prev.instructions];

      // ตรวจสอบทิศทางการเลื่อน
      if (direction === "up" && index > 0) {
        [newInstructions[index], newInstructions[index - 1]] = [
          newInstructions[index - 1],
          newInstructions[index],
        ];
      } else if (direction === "down" && index < newInstructions.length - 1) {
        [newInstructions[index], newInstructions[index + 1]] = [
          newInstructions[index + 1],
          newInstructions[index],
        ];
      }

      return { ...prev, instructions: newInstructions };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <RecipeHeader
          title="Create New Recipe"
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
              removeImage={() =>
                setRecipe((prev) => ({ ...prev, image_url: "" }))
              }
              handleCategorySelect={handleCategorySelect}
              handleTagKeyDown={handleTagKeyDown} // ✅ เพิ่ม handleTagKeyDown
            />

            <IngredientsSection
              ingredients={recipe.recipe_ingredients.map((ing) => ({
                id: ing.ingredient_id, // ✅ ใช้ ingredient_id
                name: "", // ❗ ต้องกำหนดค่าชื่อ ingredient จาก database
                amount: ing.quantity, // ✅ ใช้ quantity เป็น amount
                unit: "", // ❗ ต้องกำหนดค่า unit ให้ถูกต้อง
              }))}
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
              moveInstruction={moveInstruction} // ✅ เพิ่ม moveInstruction
            />

            <FormActions
              isSaving={isSaving}
              errors={errors}
              onCancel={() => navigate("/my-recipes")}
            />
          </div>
        </form>

        {errors.submit && (
          <p className="text-red-500 text-center mt-4">{errors.submit}</p>
        )}
      </div>
    </div>
  );
}
