import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeHeader } from "@/components/createRecipe/RecipeHeader";
import { createRecipe } from "@/lib/api/recipeApi";
import { useAuth } from "@/components/auth/AuthContext";
import { fetchCategories } from "@/lib/api/utils";
import axios from "axios";

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<
    { id: number; name: string; image_url: string }[]
  >([]);

  // ✅ ใช้ useState ในรูปแบบที่เรียบง่ายขึ้น
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

  const cloudinaryCloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dct6hlg8b";

  // ✅ อัพเดทค่าของฟอร์ม
  const updateField = (field: string, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ โหลดหมวดหมู่จาก API ทันทีที่หน้าโหลด
  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCategories();
  }, []);

  // ✅ อัพโหลดรูปภาพ
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    lastModified: number;
  } | null>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // เก็บข้อมูลไฟล์เพื่อแสดงให้ผู้ใช้เห็น
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    setIsSaving(true);

    try {
      const uploadPreset = "aroidee"; // Upload Preset ที่สร้างใน Cloudinary

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset); // ❌ ไม่ต้องใส่ cloud_name

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }, // ✅ แก้ไขตรงนี้
        }
      );

      if (cloudinaryResponse.data.secure_url) {
        setRecipe((prev) => ({
          ...prev,
          image_url: cloudinaryResponse.data.secure_url,
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
        navigate("/recipes/my-recipes");
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <RecipeHeader
            title="Create New Recipe"
            subtitle="Share your culinary creations with the world"
          />

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <div className="space-y-8">
              {/* Basic Recipe Info Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  {/* Recipe Title */}
                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Recipe Title
                    </label>
                    <input
                      type="text"
                      value={recipe.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg"
                      placeholder="Enter an appealing title for your recipe"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      A descriptive title helps others find your recipe
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={recipe.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all min-h-32"
                      placeholder="Describe your recipe, share its story, origin, or what makes it special..."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {recipe.description.length > 0
                        ? `${recipe.description.length} characters (recommended: at least 100)`
                        : "Add a compelling description to engage your audience"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Details Section - Modern Design */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-orange-500"
                  >
                    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    <path
                      fillRule="evenodd"
                      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Recipe Details
                </h3>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Selection - Enhanced Design */}
                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-orange-500 mr-2"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.23-4.23a2.25 2.25 0 000-3.183l-9.58-9.58a3 3 0 00-2.12-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <label className="text-lg font-medium text-gray-700">
                          Category
                        </label>
                      </div>

                      <div className="relative group">
                        <select
                          value={recipe.category_id ?? ""}
                          onChange={(e) =>
                            setRecipe({
                              ...recipe,
                              category_id: Number(e.target.value),
                            })
                          }
                          className="w-full p-4 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all pr-10 text-gray-700 font-medium shadow-sm group-hover:shadow-md"
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        {/* <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <div className="bg-gray-100 rounded-full p-1.5 group-hover:bg-gray-200 transition-colors">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div> */}

                        <p className="mt-2 text-sm text-gray-500 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 mr-1 text-orange-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Choose the most appropriate category for your recipe
                        </p>
                      </div>

                      {/* Category Cards Preview */}
                      <div className="pt-2">
                        <div className="flex overflow-x-auto gap-2 pb-2 mt-1 snap-x scrollbar-hide">
                          {categories.slice(0, 5).map((cat) => (
                            <div
                              key={cat.id}
                              onClick={() =>
                                setRecipe({ ...recipe, category_id: cat.id })
                              }
                              className={`flex-shrink-0 snap-start p-2 border rounded-lg cursor-pointer transition-all w-16 h-16 flex flex-col items-center justify-center ${
                                recipe.category_id === cat.id
                                  ? "bg-orange-100 border-orange-300 shadow-sm"
                                  : "bg-gray-50 border-gray-200 hover:bg-orange-50"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                                  recipe.category_id === cat.id
                                    ? "bg-orange-500"
                                    : "bg-gray-200"
                                }`}
                              >
                                <span
                                  className={`text-xs font-bold ${
                                    recipe.category_id === cat.id
                                      ? "text-white"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {cat.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-xs truncate w-full text-center">
                                {cat.name.length > 8
                                  ? cat.name.substring(0, 6) + "..."
                                  : cat.name}
                              </span>
                            </div>
                          ))}
                          {categories.length > 5 && (
                            <div className="flex-shrink-0 snap-start p-2 border rounded-lg cursor-pointer transition-all w-16 h-16 flex items-center justify-center bg-gray-50 border-gray-200 hover:bg-gray-100">
                              <span className="text-xs text-gray-500">
                                +{categories.length - 5} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cook Time - Clean Design */}
                    <div className="space-y-2">
                      <div className="flex items-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-600 mr-2"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <label className="text-lg font-medium text-gray-700">
                          Cook Time
                        </label>
                      </div>

                      <div className="relative group">
                        <div className="flex bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden group-hover:shadow-md transition-all">
                          <input
                            type="number"
                            value={recipe.cook_time}
                            onChange={(e) =>
                              setRecipe({
                                ...recipe,
                                cook_time: Number(e.target.value),
                              })
                            }
                            className="flex-grow p-4 bg-transparent border-0 focus:ring-2 focus:ring-blue-500 rounded-l-lg transition-all text-gray-700 font-medium text-center"
                            placeholder="0"
                            min="0"
                          />
                          <div className="flex items-center justify-center bg-gray-100 px-4 text-gray-700 font-medium">
                            minutes
                          </div>
                        </div>

                        <p className="mt-2 text-sm text-gray-500 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 mr-1 text-gray-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Total time needed from preparation to serving
                        </p>
                      </div>

                      {/* Time Presets */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {[15, 30, 45, 60, 90].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() =>
                              setRecipe({ ...recipe, cook_time: time })
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                              recipe.cook_time === time
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                            }`}
                          >
                            {time} min
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipe Image Section - Modern Design */}
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-orange-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">
                  Recipe Image
                </h3>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {/* Image Preview Section */}
                  <div className="md:col-span-2">
                    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200">
                      <div
                        className="relative w-full"
                        style={{ paddingTop: "56.25%" }}
                      >
                        {" "}
                        {/* 16:9 Aspect Ratio */}
                        {recipe.image_url ? (
                          <div className="absolute inset-0">
                            <img
                              src={recipe.image_url}
                              alt="Recipe preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to remove this image?"
                                    )
                                  ) {
                                    setRecipe({ ...recipe, image_url: "" });
                                    setUploadedFile(null);
                                  }
                                }}
                                className="bg-white bg-opacity-80 text-red-500 p-2 rounded-full hover:bg-opacity-100 transition-all duration-200 shadow-lg"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : uploadedFile && isSaving ? (
                          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                            <p className="text-gray-500 mt-3 text-center">
                              Uploading image...
                            </p>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-16 w-16 text-gray-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <p className="text-gray-400 mt-2 text-center">
                              No image selected
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Image status bar */}
                      {recipe.image_url && (
                        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 mr-1 text-green-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Image uploaded successfully
                            </div>
                            <span className="text-xs text-gray-400">
                              Hover to manage
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className="flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">
                        Upload Recipe Image
                      </h4>

                      <div className="space-y-4">
                        {/* Upload Button */}
                        <div className="flex flex-col">
                          <label
                            htmlFor="recipe-image-upload"
                            className="group flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200 overflow-hidden"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 group-hover:text-orange-500 transition-colors duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-600">
                                <span className="font-medium">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-400 group-hover:text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                            <input
                              id="recipe-image-upload"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>

                        {/* Image guidelines */}
                        <div className="border border-gray-100 rounded-lg p-3 bg-blue-50">
                          <h5 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4 mr-1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Image Guidelines
                          </h5>
                          <ul className="text-xs text-blue-600 space-y-1">
                            <li className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 mr-1 mt-0.5 text-blue-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Use high-quality, well-lit images</span>
                            </li>
                            <li className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 mr-1 mt-0.5 text-blue-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Show the finished dish clearly</span>
                            </li>
                            <li className="flex items-start">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3 mr-1 mt-0.5 text-blue-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>Landscape orientation works best</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* File details - shows only when a file is selected */}
                    {uploadedFile && (
                      <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-4 h-4 mr-1 text-gray-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                          File Details
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Name:</span>
                            <span className="truncate">
                              {uploadedFile.name}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Size:</span>
                            <span>
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Type:</span>
                            <span className="truncate">
                              {uploadedFile.type}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Modified:</span>
                            <span
                              title={new Date(
                                uploadedFile.lastModified
                              ).toLocaleString()}
                            >
                              {new Date(
                                uploadedFile.lastModified
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients Section - Modern Orange Theme with Move Up/Down */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-orange-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Ingredients
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-full text-sm font-medium transition-colors shadow-sm flex items-center space-x-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  <span>Add Ingredient</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                {recipe.ingredients.length > 0 ? (
                  <div className="overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-gray-100">
                      <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                        <div className="col-span-5 md:col-span-4">
                          Ingredient
                        </div>
                        <div className="col-span-3 md:col-span-2">Amount</div>
                        <div className="col-span-3 md:col-span-2">Unit</div>
                        <div className="col-span-1 md:col-span-4"></div>
                      </div>
                    </div>

                    <ul className="divide-y divide-gray-100">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="px-6 py-4 hover:bg-orange-50 transition-colors duration-150"
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Ingredient Name */}
                            <div className="col-span-5 md:col-span-4">
                              <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => {
                                  const newIngredients = [
                                    ...recipe.ingredients,
                                  ];
                                  newIngredients[index].name = e.target.value;
                                  updateField("ingredients", newIngredients);
                                }}
                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Ingredient name"
                              />
                            </div>

                            {/* Amount */}
                            <div className="col-span-3 md:col-span-2">
                              <input
                                type="text"
                                value={ingredient.amount}
                                onChange={(e) => {
                                  const newIngredients = [
                                    ...recipe.ingredients,
                                  ];
                                  newIngredients[index].amount = e.target.value;
                                  updateField("ingredients", newIngredients);
                                }}
                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Amount"
                              />
                            </div>

                            {/* Unit */}
                            <div className="col-span-3 md:col-span-2">
                              <input
                                type="text"
                                value={ingredient.unit}
                                onChange={(e) => {
                                  const newIngredients = [
                                    ...recipe.ingredients,
                                  ];
                                  newIngredients[index].unit = e.target.value;
                                  updateField("ingredients", newIngredients);
                                }}
                                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="Unit"
                              />
                            </div>

                            {/* Action Buttons for Desktop */}
                            <div className="col-span-1 md:col-span-4 flex justify-end items-center space-x-1">
                              {/* Move Up Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (index > 0) {
                                    const newIngredients = [
                                      ...recipe.ingredients,
                                    ];
                                    // Swap with previous ingredient
                                    [
                                      newIngredients[index],
                                      newIngredients[index - 1],
                                    ] = [
                                      newIngredients[index - 1],
                                      newIngredients[index],
                                    ];
                                    updateField("ingredients", newIngredients);
                                  }
                                }}
                                disabled={index === 0}
                                className={`p-2 rounded-full transition-colors hidden md:block ${
                                  index === 0
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-orange-100"
                                }`}
                                title="Move Up"
                                aria-label="Move ingredient up"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              {/* Move Down Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (index < recipe.ingredients.length - 1) {
                                    const newIngredients = [
                                      ...recipe.ingredients,
                                    ];
                                    // Swap with next ingredient
                                    [
                                      newIngredients[index],
                                      newIngredients[index + 1],
                                    ] = [
                                      newIngredients[index + 1],
                                      newIngredients[index],
                                    ];
                                    updateField("ingredients", newIngredients);
                                  }
                                }}
                                disabled={
                                  index === recipe.ingredients.length - 1
                                }
                                className={`p-2 rounded-full transition-colors hidden md:block ${
                                  index === recipe.ingredients.length - 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-orange-100"
                                }`}
                                title="Move Down"
                                aria-label="Move ingredient down"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors hidden md:block"
                                title="Remove ingredient"
                                aria-label="Remove ingredient"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              {/* Mobile Delete Button - visible only on small screens */}
                              <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors md:hidden"
                                title="Remove ingredient"
                                aria-label="Remove ingredient"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Mobile Up/Down Controls - only visible on small screens */}
                          <div className="mt-2 flex justify-center space-x-2 md:hidden">
                            <button
                              type="button"
                              onClick={() => {
                                if (index > 0) {
                                  const newIngredients = [
                                    ...recipe.ingredients,
                                  ];
                                  [
                                    newIngredients[index],
                                    newIngredients[index - 1],
                                  ] = [
                                    newIngredients[index - 1],
                                    newIngredients[index],
                                  ];
                                  updateField("ingredients", newIngredients);
                                }
                              }}
                              disabled={index === 0}
                              className={`p-1.5 rounded-md transition-colors flex items-center ${
                                index === 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs">Move Up</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (index < recipe.ingredients.length - 1) {
                                  const newIngredients = [
                                    ...recipe.ingredients,
                                  ];
                                  [
                                    newIngredients[index],
                                    newIngredients[index + 1],
                                  ] = [
                                    newIngredients[index + 1],
                                    newIngredients[index],
                                  ];
                                  updateField("ingredients", newIngredients);
                                }
                              }}
                              disabled={index === recipe.ingredients.length - 1}
                              className={`p-1.5 rounded-md transition-colors flex items-center ${
                                index === recipe.ingredients.length - 1
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-xs">Move Down</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      No ingredients added yet
                    </h4>
                    <p className="text-gray-500 mb-4">
                      Your recipe needs at least one ingredient
                    </p>
                    <button
                      type="button"
                      onClick={addIngredient}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white hover:bg-orange-700 rounded-md transition-colors shadow-sm text-sm font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-1"
                      >
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                      </svg>
                      Add Your First Ingredient
                    </button>
                  </div>
                )}

                {/* Helper information */}
                {recipe.ingredients.length > 0 && (
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-2 text-orange-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Tip: You can reorder ingredients using the up and down
                        arrows
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions Section - Modern Design with Move Up/Down */}
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-orange-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.625 6.75a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0A.75.75 0 018.25 6h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75zM2.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM7.5 12a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12A.75.75 0 017.5 12zm-4.875 5.25a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875 0a.75.75 0 01.75-.75h12a.75.75 0 010 1.5h-12a.75.75 0 01-.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800">
                    Cooking Instructions
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={addInstruction}
                  className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-all shadow-sm flex items-center space-x-1 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  <span>Add Step</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="p-1">
                  {recipe.instructions.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {recipe.instructions.map((step, index) => (
                        <li
                          key={index}
                          className="p-3 hover:bg-orange-50 transition-colors duration-150"
                        >
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                            {/* Step Number */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                {index + 1}
                              </div>
                            </div>

                            {/* Input Field */}
                            <div className="flex-grow w-full">
                              <input
                                type="text"
                                value={step}
                                onChange={(e) => {
                                  const newInstructions = [
                                    ...recipe.instructions,
                                  ];
                                  newInstructions[index] = e.target.value;
                                  updateField("instructions", newInstructions);
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                placeholder={`Describe step ${
                                  index + 1
                                } in detail...`}
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex-shrink-0 flex items-center space-x-1 self-center md:self-auto w-full md:w-auto justify-end mt-2 md:mt-0">
                              {/* Move Up Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (index > 0) {
                                    const newInstructions = [
                                      ...recipe.instructions,
                                    ];
                                    // Swap with previous step
                                    [
                                      newInstructions[index],
                                      newInstructions[index - 1],
                                    ] = [
                                      newInstructions[index - 1],
                                      newInstructions[index],
                                    ];
                                    updateField(
                                      "instructions",
                                      newInstructions
                                    );
                                  }
                                }}
                                disabled={index === 0}
                                className={`p-2 rounded-full transition-colors ${
                                  index === 0
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-orange-100"
                                }`}
                                title="Move Up"
                                aria-label="Move step up"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              {/* Move Down Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (index < recipe.instructions.length - 1) {
                                    const newInstructions = [
                                      ...recipe.instructions,
                                    ];
                                    // Swap with next step
                                    [
                                      newInstructions[index],
                                      newInstructions[index + 1],
                                    ] = [
                                      newInstructions[index + 1],
                                      newInstructions[index],
                                    ];
                                    updateField(
                                      "instructions",
                                      newInstructions
                                    );
                                  }
                                }}
                                disabled={
                                  index === recipe.instructions.length - 1
                                }
                                className={`p-2 rounded-full transition-colors ${
                                  index === recipe.instructions.length - 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-orange-100"
                                }`}
                                title="Move Down"
                                aria-label="Move step down"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => removeInstruction(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Remove Step"
                                aria-label="Remove step"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Optional: Add tags or additional info per step */}
                          {step.length > 0 && (
                            <div className="mt-2 ml-4 md:ml-14 flex flex-wrap gap-1">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className="w-3 h-3 mr-1"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Step {index + 1}
                              </span>
                              {step.length < 20 && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-3 h-3 mr-1"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Add more details
                                </span>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-6 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="mt-2 text-gray-500">
                        No instructions added yet. Click "Add Step" to get
                        started.
                      </p>
                    </div>
                  )}
                </div>

                {/* Helper text */}
                {recipe.instructions.length > 0 && (
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-2 text-orange-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Tip: You can reorder steps using the up and down arrows
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nutrition Facts Section - Modern Design */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-orange-500"
                    >
                      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Nutrition Facts
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                  Per Serving
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Main nutrition information */}
                <div className="p-6 space-y-6">
                  {/* Calories - Large display */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div>
                      <h4 className="text-sm uppercase tracking-wider text-orange-600 font-semibold">
                        Calories
                      </h4>
                      <p className="text-xs text-orange-500 mt-1">
                        Calories per serving
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={recipe.nutrition_facts.calories}
                        onChange={(e) =>
                          setRecipe((prev) => ({
                            ...prev,
                            nutrition_facts: {
                              ...prev.nutrition_facts,
                              calories: e.target.value,
                            },
                          }))
                        }
                        className="w-24 p-2 text-right border-0 focus:ring-2 focus:ring-orange-500 rounded-md bg-white shadow-sm text-2xl font-bold text-orange-600"
                        min="0"
                        placeholder="0"
                      />
                      <span className="ml-2 text-orange-600 font-medium">
                        kcal
                      </span>
                    </div>
                  </div>

                  {/* Macronutrients - Horizontal display */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Protein */}
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-blue-100 transition-all hover:shadow-md">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-4 h-4"
                          >
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        </div>
                        <h4 className="text-blue-700 font-medium">Protein</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={recipe.nutrition_facts.protein}
                          onChange={(e) =>
                            setRecipe((prev) => ({
                              ...prev,
                              nutrition_facts: {
                                ...prev.nutrition_facts,
                                protein: e.target.value,
                              },
                            }))
                          }
                          className="w-full p-2 text-right border-0 focus:ring-2 focus:ring-blue-500 rounded-md bg-white shadow-sm text-lg font-semibold text-blue-600"
                          min="0"
                          placeholder="0"
                        />
                        <span className="ml-2 text-blue-600">g</span>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100 transition-all hover:shadow-md">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-amber-700 font-medium">Carbs</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={recipe.nutrition_facts.total_carbohydrate}
                          onChange={(e) =>
                            setRecipe((prev) => ({
                              ...prev,
                              nutrition_facts: {
                                ...prev.nutrition_facts,
                                total_carbohydrate: e.target.value,
                              },
                            }))
                          }
                          className="w-full p-2 text-right border-0 focus:ring-2 focus:ring-amber-500 rounded-md bg-white shadow-sm text-lg font-semibold text-amber-600"
                          min="0"
                          placeholder="0"
                        />
                        <span className="ml-2 text-amber-600">g</span>
                      </div>
                    </div>

                    {/* Fats */}
                    <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-4 border border-rose-100 transition-all hover:shadow-md">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-rose-700 font-medium">Fats</h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={recipe.nutrition_facts.total_fat}
                          onChange={(e) =>
                            setRecipe((prev) => ({
                              ...prev,
                              nutrition_facts: {
                                ...prev.nutrition_facts,
                                total_fat: e.target.value,
                              },
                            }))
                          }
                          className="w-full p-2 text-right border-0 focus:ring-2 focus:ring-rose-500 rounded-md bg-white shadow-sm text-lg font-semibold text-rose-600"
                          min="0"
                          placeholder="0"
                        />
                        <span className="ml-2 text-rose-600">g</span>
                      </div>
                    </div>
                  </div>

                  {/* Sugar and Saturated Fat */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Sugars
                          </h4>
                          <p className="text-xs text-gray-500">Total sugars</p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={recipe.nutrition_facts.sugars}
                            onChange={(e) =>
                              setRecipe((prev) => ({
                                ...prev,
                                nutrition_facts: {
                                  ...prev.nutrition_facts,
                                  sugars: e.target.value,
                                },
                              }))
                            }
                            className="w-16 p-2 text-right border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-md bg-white text-sm font-medium"
                            min="0"
                            placeholder="0"
                          />
                          <span className="ml-2 text-gray-600 text-sm">g</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">
                            Saturated Fat
                          </h4>
                          <p className="text-xs text-gray-500">
                            From total fat
                          </p>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={recipe.nutrition_facts.saturated_fat}
                            onChange={(e) =>
                              setRecipe((prev) => ({
                                ...prev,
                                nutrition_facts: {
                                  ...prev.nutrition_facts,
                                  saturated_fat: e.target.value,
                                },
                              }))
                            }
                            className="w-16 p-2 text-right border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-md bg-white text-sm font-medium"
                            min="0"
                            placeholder="0"
                          />
                          <span className="ml-2 text-gray-600 text-sm">g</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional nutrition info */}
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">
                    Additional Nutrition Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cholesterol */}
                    <div className="group">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm group-hover:border-orange-200 transition-colors">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-teal-400 rounded-full mr-3"></div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                              Cholesterol
                            </p>
                            <p className="text-xs text-gray-400">
                              Total cholesterol
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={recipe.nutrition_facts.cholesterol}
                            onChange={(e) =>
                              setRecipe((prev) => ({
                                ...prev,
                                nutrition_facts: {
                                  ...prev.nutrition_facts,
                                  cholesterol: e.target.value,
                                },
                              }))
                            }
                            className="w-16 p-2 text-right border-0 focus:ring-2 focus:ring-orange-500 rounded-md bg-gray-50 text-sm font-medium"
                            min="0"
                            placeholder="0"
                          />
                          <span className="ml-1 text-gray-500 text-xs">mg</span>
                        </div>
                      </div>
                    </div>

                    {/* Sodium */}
                    <div className="group">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm group-hover:border-orange-200 transition-colors">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-blue-400 rounded-full mr-3"></div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                              Sodium
                            </p>
                            <p className="text-xs text-gray-400">
                              Salt content
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={recipe.nutrition_facts.sodium}
                            onChange={(e) =>
                              setRecipe((prev) => ({
                                ...prev,
                                nutrition_facts: {
                                  ...prev.nutrition_facts,
                                  sodium: e.target.value,
                                },
                              }))
                            }
                            className="w-16 p-2 text-right border-0 focus:ring-2 focus:ring-orange-500 rounded-md bg-gray-50 text-sm font-medium"
                            min="0"
                            placeholder="0"
                          />
                          <span className="ml-1 text-gray-500 text-xs">mg</span>
                        </div>
                      </div>
                    </div>

                    {/* Potassium */}
                    <div className="group">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm group-hover:border-orange-200 transition-colors">
                        <div className="flex items-center">
                          <div className="w-2 h-6 bg-purple-400 rounded-full mr-3"></div>
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 tracking-wide">
                              Potassium
                            </p>
                            <p className="text-xs text-gray-400">
                              Mineral content
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={recipe.nutrition_facts.potassium}
                            onChange={(e) =>
                              setRecipe((prev) => ({
                                ...prev,
                                nutrition_facts: {
                                  ...prev.nutrition_facts,
                                  potassium: e.target.value,
                                },
                              }))
                            }
                            className="w-16 p-2 text-right border-0 focus:ring-2 focus:ring-orange-500 rounded-md bg-gray-50 text-sm font-medium"
                            min="0"
                            placeholder="0"
                          />
                          <span className="ml-1 text-gray-500 text-xs">mg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition disclaimer */}
                  <div className="mt-6 text-xs text-gray-500 italic flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1 text-gray-400"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p>
                      Nutritional information is approximate and may vary based
                      on cooking methods and ingredients used.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className={`w-full py-3 px-6 rounded-lg text-white font-bold text-lg transition-all ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving Recipe...
                  </span>
                ) : (
                  "Save Recipe"
                )}
              </button>

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
                  {errors.submit}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
