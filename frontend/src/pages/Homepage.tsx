import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/components/auth/AuthContext";
import Hero from "@/components/main/Hero";
import Categories from "@/components/main/Categories";
import Content from "@/components/main/Content";
import ShareRecipe from "@/components/main/ShareRecipe";
import FeaturedRecipes from "@/components/main/FeaturedRecipes";
import LatestRecipes from "@/components/main/LatestRecipesGrid";

const API_URL = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== "" 
  ? import.meta.env.VITE_API_URL 
  : "https://aroi-dee-backend.vercel.app";

interface Recipe {
  id: number;
  title: string;
  author: string;
  image_url: string;
  cook_time: number;
  calories: number;
  rating?: number | null;
  ingredients: string[];
  isFavorite: boolean;
  created_at?: string; // เพิ่ม timestamp เพื่อจัดเรียงตามเวลา
}

const Homepage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // 📌 ดึงข้อมูลจาก Backend
  useEffect(() => {
    axios.get(`${API_URL}/api/recipes`)
      .then((response) => {
        console.log("Fetched Recipes:", response.data); // ✅ ตรวจสอบค่าที่ frontend ได้รับ
  
        if (response.data.success) {
          const fetchedRecipes = response.data.data.map((recipe: any) => ({
            id: recipe.id,
            title: recipe.title,
            author: recipe.author || "Unknown", // ✅ ใช้ `author` แทน users.username
            image_url: recipe.image_url || "/default-recipe.jpg",
            cook_time: recipe.cook_time ?? 0, // ✅ ถ้าไม่มีค่าให้ใช้ 0
            calories: recipe.calories ?? 0, // ✅ calories มาจาก API ตรงๆ
            rating: recipe.rating ?? null, // ✅ ตรวจสอบค่า rating
            ingredients: recipe.ingredients || [],
            isFavorite: false,
            created_at: recipe.created_at, // เพิ่ม timestamp สำหรับการจัดเรียง
          }));
  
          setRecipes(fetchedRecipes);
          
          // จัดเรียงและตั้งค่า latest recipes โดยใช้เวลาที่สร้าง
          const sortedLatestRecipes = [...fetchedRecipes]
            .sort((a, b) => {
              // จัดเรียงตามเวลาที่สร้าง โดยล่าสุดจะอยู่ก่อน
              const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
              const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
              return dateB - dateA;
            });
            
          setLatestRecipes(sortedLatestRecipes);
        } else {
          setError("Failed to load recipes.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes.");
        setLoading(false);
      });
  }, []);
  

  // 📌 ฟังก์ชัน Toggle Favorite
  const toggleFavorite = (index: number) => {
    setRecipes((prev) => prev.map((recipe, i) => 
      i === index ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
  };

  // ฟังก์ชัน Toggle Favorite สำหรับ latest recipes (โดยใช้ id)
  const toggleLatestFavorite = (id: number) => {
    setLatestRecipes((prev) => prev.map((recipe) => 
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
    
    // อัพเดต favorite ในรายการหลักด้วย
    setRecipes((prev) => prev.map((recipe) => 
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <main className="container mx-auto py-6 px-4">
        <Categories />
        <FeaturedRecipes />

        {/* ✅ เพิ่ม loading & error handling */}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <Content topic="Recommended" recipes={recipes} toggleFavorite={toggleFavorite} />
        
        {/* ส่ง props ไปยัง LatestRecipes component */}
        {!loading && <LatestRecipes recipes={latestRecipes} toggleFavorite={toggleLatestFavorite} />}
        
        {isAuthenticated && <ShareRecipe />}
      </main>
    </div>
  );
};

export default Homepage;