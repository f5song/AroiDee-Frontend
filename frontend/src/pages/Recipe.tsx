import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // ใช้ดึง `id` จาก URL
import {
  Star, User, Clock, 
} from "lucide-react";

// Types
interface Nutrition {
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  sugar: number | null;
}

interface Category {
  id: number;
  name: string;
  image_url: string | null;
}

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  quantity: number;
}

interface RecipeData {
  id: number;
  title: string;
  author: string;
  created_at: string;
  rating: number;
  image_url: string;
  cook_time: number;
  nutrition_facts: Nutrition | null;
  categories: Category[];
  ingredients: Ingredient[];
  instructions: string[];
}

const RecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ดึง ID ของ recipe จาก URL
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ingredients");


  const [currentStep, setCurrentStep] = useState<number>(0);
  const [cookingMode] = useState<boolean>(false);

  // ✅ โหลดข้อมูลสูตรอาหารจาก API
  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://aroi-dee-backend.vercel.app/api/recipes/${id}`);
        const data = await response.json();

        if (!data.success) throw new Error(data.message);
        
        setRecipe(data.data);
        setCheckedIngredients(Array(data.data.ingredients.length).fill(false));
      } catch (err: any) {
        setError(err.message || "Failed to fetch recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="text-center py-10">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="text-center text-red-500 py-10">เกิดข้อผิดพลาด: {error}</div>;
  if (!recipe) return <div className="text-center py-10">ไม่พบสูตรอาหาร</div>;

  // ✅ ฟังก์ชันจัดการส่วนผสม
  const handleIngredientClick = (index: number): void => {
    setCheckedIngredients((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };



  // ✅ ฟังก์ชันจัดการ Cooking Mode

  const nextStep = (): void => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {cookingMode ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold">โหมดทำอาหาร: {recipe.title}</h2>
            <p className="text-lg">{recipe.instructions[currentStep]}</p>
            <div className="flex gap-4 mt-4">
              <button onClick={prevStep} disabled={currentStep === 0} className="px-4 py-2 bg-gray-200 rounded">ย้อนกลับ</button>
              <button onClick={nextStep} disabled={currentStep === recipe.instructions.length - 1} className="px-4 py-2 bg-orange-500 text-white rounded">ถัดไป</button>
            </div>
          </div>
        ) : (
          <>
            {/* Recipe Header */}
            <div className="relative rounded-xl overflow-hidden">
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-96 object-cover" />
              <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h1 className="text-4xl font-bold text-white">{recipe.title}</h1>
                <div className="flex gap-3 mt-2 text-white">
                  <span><User size={16} /> {recipe.author}</span>
                  <span><Clock size={16} /> {recipe.cook_time} นาที</span>
                  <span><Star size={16} /> {recipe.rating}</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex space-x-4 border-b">
              <button onClick={() => setActiveTab("ingredients")} className={`py-2 px-4 ${activeTab === "ingredients" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-600"}`}>ส่วนผสม</button>
              <button onClick={() => setActiveTab("instructions")} className={`py-2 px-4 ${activeTab === "instructions" ? "border-b-2 border-orange-500 text-orange-500" : "text-gray-600"}`}>วิธีทำ</button>
            </div>

            <div className="p-4 bg-white rounded-xl shadow mt-4">
              {activeTab === "ingredients" && (
                <ul>
                  {recipe.ingredients.map((ing, index) => (
                    <li key={ing.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={checkedIngredients[index]} onChange={() => handleIngredientClick(index)} />
                      {ing.quantity} {ing.unit} {ing.name}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "instructions" && (
                <ol className="list-decimal pl-5">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="mt-2">{step}</li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RecipePage;
