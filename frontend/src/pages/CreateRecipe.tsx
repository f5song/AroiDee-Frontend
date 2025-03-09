import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { createRecipe } from "@/lib/api/recipeApi";
import { useAuth } from "@/components/auth/AuthContext";
import { fetchCategories, uploadImageToCloudinary } from "@/lib/api/utils";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<
    { id: number; name: string; image_url: string }[]
  >([]);

  // ✅ ตั้งค่า Recipe State
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    instructions: [""], 
    image_url: "",
    cook_time: 0,
    category_id: null as number | null,
    ingredients: [{ name: "", amount: "", unit: "" }],
    nutrition_facts: {
      calories: 0,
      total_fat: 0,
      saturated_fat: 0,
      cholesterol: 0,
      sodium: 0,
      potassium: 0,
      total_carbohydrate: 0,
      sugars: 0,
      protein: 0,
    },
  });

  // ✅ โหลดหมวดหมู่จาก API
  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // ✅ อัพโหลดรูปภาพไปยัง Cloudinary
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    const imageUrl = await uploadImageToCloudinary(file, "recipes"); 
    if (imageUrl) {
      setRecipe((prev) => ({ ...prev, image_url: imageUrl }));
    }
    setIsSaving(false);
  };

  // ✅ อัพเดทค่าของฟอร์ม
  const updateField = (field: string, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ เพิ่มและลบส่วนผสม
  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", unit: "" }],
    }));
  };

  // const removeIngredient = (index: number) => {
  //   setRecipe((prev) => ({
  //     ...prev,
  //     ingredients: prev.ingredients.filter((_, i) => i !== index),
  //   }));
  // };

  // ✅ เพิ่มและลบขั้นตอนการทำอาหาร
  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  // const removeInstruction = (index: number) => {
  //   setRecipe((prev) => ({
  //     ...prev,
  //     instructions: prev.instructions.filter((_, i) => i !== index),
  //   }));
  // };

  // ✅ บันทึกสูตรอาหารลงฐานข้อมูล
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
    <div className="min-h-screen bg-white p-6 md:p-8 lg:p-10 shadow-lg rounded-lg">
      <div className="max-w-3xl mx-auto">
        <RecipeHeader title="Create New Recipe" subtitle="Share your culinary creations with the world" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={recipe.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Title" />
          <textarea value={recipe.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Description" />

          {/* Categories Dropdown */}
          <select value={recipe.category_id ?? ""} onChange={(e) => updateField("category_id", Number(e.target.value))}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Cook Time */}
          <input type="number" value={recipe.cook_time} onChange={(e) => updateField("cook_time", Number(e.target.value))} placeholder="Cook Time" />

          {/* Ingredients */}
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index}>
              <input type="text" value={ingredient.name} onChange={(e) => {
                const newIngredients = [...recipe.ingredients];
                newIngredients[index].name = e.target.value;
                updateField("ingredients", newIngredients);
              }} placeholder="Ingredient" />
            </div>
          ))}
          <button type="button" onClick={addIngredient}>+ Add Ingredient</button>

          {/* Instructions */}
          {recipe.instructions.map((step, index) => (
            <div key={index}>
              <input type="text" value={step} onChange={(e) => {
                const newInstructions = [...recipe.instructions];
                newInstructions[index] = e.target.value;
                updateField("instructions", newInstructions);
              }} placeholder="Instruction step" />
            </div>
          ))}
          <button type="button" onClick={addInstruction}>+ Add Step</button>

          {/* Upload Image */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {recipe.image_url && <img src={recipe.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}

          {/* Submit Button */}
          <button type="submit">{isSaving ? "Saving..." : "Save Recipe"}</button>
          {errors.submit && <p className="text-red-500">{errors.submit}</p>}
        </form>
      </div>
    </div>
  );
}
