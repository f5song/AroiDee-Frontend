import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { createRecipe } from "@/lib/api/recipeApi";
import { useAuth } from "@/components/auth/AuthContext";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // ✅ ใช้ useState ในรูปแบบที่เรียบง่ายขึ้น
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    instructions: [""], // ✅ ใช้เป็น array ของ string
    image_url: "",
    cook_time: 0,
    category_id: null as number | null,
    ingredients: [{ name: "", amount: "", unit: "" }], // ✅ เรียบง่ายขึ้น
  });

  // ✅ อัพเดทค่าของฟอร์ม
  const updateField = (field: string, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ อัพโหลดรูปภาพ
  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => setRecipe((prev) => ({ ...prev, image_url: reader.result as string }));
  //   reader.readAsDataURL(file);
  // };

  // ✅ เพิ่มและลบส่วนผสม
  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", unit: "" }],
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  // ✅ เพิ่มและลบขั้นตอนการทำอาหาร
  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const removeInstruction = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  // ✅ ส่งฟอร์มไปยัง backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!token || !user) {
      alert("You must be logged in to create a recipe");
      setIsSaving(false);
      return;
    }

    const formattedRecipe = {
      ...recipe,
      user_id: user.id,
      instructions: JSON.stringify(recipe.instructions), // ✅ ส่งเป็น JSON
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
    <div className="min-h-screen bg-white p-6 md:p-8 lg:p-10 shadow-lg rounded-lg">
      <div className="max-w-3xl mx-auto">
        <RecipeHeader title="Create New Recipe" subtitle="Share your culinary creations with the world" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Title */}
          <div>
            <label className="block text-lg font-semibold">Title</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter recipe title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold">Description</label>
            <textarea
              value={recipe.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter description"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-lg font-semibold">Ingredients</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex space-x-2 mt-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...recipe.ingredients];
                    newIngredients[index].name = e.target.value;
                    updateField("ingredients", newIngredients);
                  }}
                  placeholder="Ingredient"
                  className="flex-1 p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={ingredient.amount}
                  onChange={(e) => {
                    const newIngredients = [...recipe.ingredients];
                    newIngredients[index].amount = e.target.value;
                    updateField("ingredients", newIngredients);
                  }}
                  placeholder="Amount"
                  className="w-20 p-2 border rounded-md"
                />
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => {
                    const newIngredients = [...recipe.ingredients];
                    newIngredients[index].unit = e.target.value;
                    updateField("ingredients", newIngredients);
                  }}
                  placeholder="Unit"
                  className="w-20 p-2 border rounded-md"
                />
                <button type="button" onClick={() => removeIngredient(index)} className="text-red-500">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="text-blue-500 mt-2">
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-lg font-semibold">Instructions</label>
            {recipe.instructions.map((step, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newInstructions = [...recipe.instructions];
                    newInstructions[index] = e.target.value;
                    updateField("instructions", newInstructions);
                  }}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Instruction step"
                />
                <button type="button" onClick={() => removeInstruction(index)} className="text-red-500">
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addInstruction} className="text-blue-500 mt-2">
              + Add Step
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-orange-500 text-white p-3 rounded-md font-bold">
            {isSaving ? "Saving..." : "Save Recipe"}
          </button>

          {errors.submit && <p className="text-red-500 text-center mt-4">{errors.submit}</p>}
        </form>
      </div>
    </div>
  );
}
