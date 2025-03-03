import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import AuthDemoComponent from "@/components/auth/AuthDemoComponent";
import Hero from "@/components/main/Hero";
import Categories from "@/components/main/Categories";
import Content from "@/components/main/Content";
import ShareRecipe from "@/components/main/ShareRecipe"; 
import FeaturedRecipes from "@/components/main/FeaturedRecipes";
import LatestRecipes from "@/components/main/LatestRecipesGrid";

const recipesData = [
  {
    title: "Oatmeal Pancakes",
    author: "Sarah Johnson",
    image: "/placeholder.svg",
    cookTime: "20 mins",
    calories: 320,
    rating: 4.8,
    ingredients: ["Oats", "Milk", "Egg", "Honey"],
    isFavorite: true
  },
  {
    title: "Herb Roasted Chicken",
    author: "Jane Doe",
    image: "/placeholder.svg",
    cookTime: "60 mins",
    calories: 450,
    rating: 4.5,
    ingredients: ["Chicken", "Basil", "Garlic", "Pepper", "Olive Oil"],
    isFavorite: false
  },
  {
    title: "Mixed Vegetable Salad",
    author: "Mike Wilson",
    image: "/placeholder.svg",
    cookTime: "15 mins",
    calories: 180,
    rating: 4.2,
    ingredients: ["Salad Greens", "Tomato", "Cucumber", "Avocado"],
    isFavorite: false
  },
  {
    title: "Berry Smoothie",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 150,
    rating: 4.7,
    ingredients: ["Strawberries", "Blueberries", "Yogurt"],
    isFavorite: true
  },
  {
    title: "Berry Smoothie",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 150,
    rating: 4.7,
    ingredients: ["Strawberries", "Blueberries", "Yogurt"],
    isFavorite: true
  },
  {
    title: "Berry Smoothie",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 150,
    rating: 4.7,
    ingredients: ["Strawberries", "Blueberries", "Yogurt"],
    isFavorite: true
  },
  {
    title: "Berry Smoothie",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 150,
    rating: 4.7,
    ingredients: ["Strawberries", "Blueberries", "Yogurt"],
    isFavorite: true
  },
  {
    title: "Berry Smoothie",
    author: "Emily Clark",
    image: "/placeholder.svg",
    cookTime: "10 mins",
    calories: 150,
    rating: 4.7,
    ingredients: ["Strawberries", "Blueberries", "Yogurt"],
    isFavorite: true
  }
];

const Landing: React.FC = () => {
  const [recipes, setRecipes] = useState(recipesData);
  const { isAuthenticated } = useAuth();

  const toggleFavorite = (index: number) => {
    setRecipes((prev) =>
      prev.map((recipe, i) =>
        i === index ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar removed here as it's now in the App.tsx wrapper */}
      {/* Hero Section */}
      <Hero />
      <main className="container mx-auto py-6 px-4">
        {/* Dev Authentication Demo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">ทดสอบการเข้าสู่ระบบ</h2>
            <p className="text-gray-600 mb-4">
              ใช้ปุ่มด้านล่างเพื่อสลับระหว่างการเข้าสู่ระบบและออกจากระบบ เพื่อทดสอบการแสดงผล Navbar
            </p>
            <AuthDemoComponent />
          </div>
        )}
        
        {/* Popular Categories */}
        <Categories />
        
        {/* Featured Recipes (Super Delicious Section) */}
        <FeaturedRecipes />
        
        {/* Recommended Recipes */}
        <Content topic="Recommended" recipes={recipes} toggleFavorite={toggleFavorite} />
        
        {/* Most Popular Recipes */}
        <Content topic="Most Popular Recipes" recipes={recipes} toggleFavorite={toggleFavorite} />
        
        {/* Latest Recipes Grid */}
        <LatestRecipes />

        {/* Share Recipe - only shown to authenticated users */}
        {isAuthenticated && <ShareRecipe />}
      </main>
      {/* Footer removed here as it's now in the App.tsx wrapper */}
    </div>
  );
};

export default Landing;