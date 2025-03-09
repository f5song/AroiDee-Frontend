import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { createRecipe } from "@/lib/api/recipeApi";
import { fetchCategories, uploadImageToCloudinary } from "@/lib/api/utils"; // ✅ นำเข้า API Helper
import { useAuth } from "@/components/auth/AuthContext";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ ใช้ useState เพื่อเก็บค่าหมวดหมู่ที่ดึงมา
  const [categories, setCategories] = useState<{ id: number; name: string; image_url: string }[]>([]);

  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    instructions: [""], 
    image_url: "",
    cook_time: 0,
    category_id: null as number | null,
    ingredients: [{ name: "", amount: "", unit: "" }], 
    nutrition_facts: {
      calories: "",
      total_fat: "",
      saturated_fat: "",
      cholesterol: "",
      sodium: "",
      potassium: "",
      total_carbohydrate: "",
      sugars: "",
      protein: "",
    },
  });

  // ✅ โหลดหมวดหมู่จาก API ทันทีที่หน้าโหลด
  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // ✅ ฟังก์ชันอัปโหลดรูปภาพไปยัง Cloudinary
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    const imageUrl = await uploadImageToCloudinary(file, "profile"); // ✅ อัปโหลดไปที่โฟลเดอร์ `profile`
    setRecipe((prev) => ({ ...prev, image_url: imageUrl }));
    setIsSaving(false);
  };

  // ✅ ฟังก์ชันส่งฟอร์มไปยัง backend
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
          {/* Recipe Title */}
          <div>
            <label className="block text-lg font-semibold">Title</label>
            <input
              type="text"
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter recipe title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold">Description</label>
            <textarea
              value={recipe.description}
              onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter description"
            />
          </div>

          {/* Categories Dropdown */}
          <div>
            <label className="block text-lg font-semibold">Category</label>
            <select
              value={recipe.category_id ?? ""}
              onChange={(e) => setRecipe({ ...recipe, category_id: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nutrition Facts */}
          <div>
            <label className="block text-lg font-semibold">Nutrition Facts</label>
            {Object.keys(recipe.nutrition_facts).map((key) => (
              <div key={key} className="flex space-x-2 mt-2">
                <label className="w-32 capitalize">{key.replace("_", " ")}:</label>
                <input
                  type="text"
                  value={recipe.nutrition_facts[key as keyof typeof recipe.nutrition_facts]}
                  onChange={(e) => 
                    setRecipe({
                      ...recipe,
                      nutrition_facts: { ...recipe.nutrition_facts, [key]: e.target.value },
                    })
                  }
                  className="flex-1 p-2 border rounded-md"
                  placeholder="Enter value"
                />
              </div>
            ))}
          </div>

          {/* Cook Time */}
          <div>
            <label className="block text-lg font-semibold">Cook Time (Minutes)</label>
            <input
              type="number"
              value={recipe.cook_time}
              onChange={(e) => setRecipe({ ...recipe, cook_time: Number(e.target.value) })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter cook time"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-lg font-semibold">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
            {recipe.image_url && <img src={recipe.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
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
