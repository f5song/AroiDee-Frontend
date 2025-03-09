// Types for Recipe Data
import { Dispatch, SetStateAction } from "react";
export interface Nutrition {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    sugar: string;
    
  }

  export interface Ingredient {
    id: number;
    name: string;
    unit: string;
    quantity: number;
  }
  
  export interface RelatedRecipe {
    id: number;
    title: string;
    image?: string; // ✅ ใช้ image ตาม API
    image_url?: string; // ✅ รองรับกรณีมี image_url
    cook_time?: number;
    rating?: number;
  }
  
  
  export interface Comment {
    user: string;
    text: string;
    date: string;
  }
  
  export interface RecipeData {
    id: any;
    title: string;
    author: string;
    date: string;
    rating: number;
    comments: number;
    image_url: string;
    prepTime: string;
    cookTime: string;
    difficulty: string;
    ingredients: string[];
    instructions: string[];
    nutrition: Nutrition;
    freshRecipes: RelatedRecipe[];
    commentsList: Comment[];
  }
  
  // Props Interfaces
  export interface RecipeHeaderProps {
    title: string;
    author: string;
    date: string;
    rating: number;
    comments: number;
    image_url: string;
    recipeId: number;
    userId: number;
    saved: boolean;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
    token: string; // ✅ เพิ่ม token
  }
  

  
  export interface ControlBarProps {
    toggleUnit: () => void;
    selectedUnit: string;
    setShowAllergies: React.Dispatch<React.SetStateAction<boolean>>;
    showAllergies: boolean;
    toggleCookingMode: () => void;
  }
  
  export interface AllergyInfoProps {
    showAllergies: boolean;
    setShowAllergies: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export interface IngredientsTabProps {
    ingredients: Ingredient[]; // ✅ ใช้โครงสร้างที่ถูกต้อง
    checkedIngredients: boolean[];
    handleIngredientClick: (index: number) => void;
    getConvertedIngredient: (ingredient: Ingredient) => string;
  }

  export interface InstructionsTabProps {
    instructions: string[];
    toggleCookingMode: () => void;
    setTimerMinutes: (minutes: number) => void;
  }
  
  export interface CommentsTabProps {
    commentsList: Comment[];
    newComment: string;
    setNewComment: React.Dispatch<React.SetStateAction<string>>;
    handleCommentSubmit: () => void;
  }
  
  export interface NutritionFactsProps {
    nutrition: Nutrition;
    showNutritionDetails: boolean;
    setShowNutritionDetails: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  export interface RelatedRecipesProps {
    recipes: RelatedRecipe[];
  }
  
  export interface TimerProps {
    timer: number;
    timerActive: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    setTimerMinutes: (minutes: number) => void;
  }
  
  export interface CookingModeViewProps {
    recipe: RecipeData;
    toggleCookingMode: () => void;
    currentStep: number;
    prevStep: () => void;
    nextStep: () => void;
    checkedIngredients: boolean[];
    handleIngredientClick: (index: number) => void;
    getConvertedIngredient: (ingredient: { name: string; quantity: number; unit: string }) => string;
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>; // ✅ เพิ่ม setTimer ให้ TypeScript รับรู้
    timerActive: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    setTimerMinutes: (minutes: number) => void;
  }
  

  
  export interface TabContainerProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
    commentCount: number;
    children: React.ReactNode;
  }

  export interface TimerProps {
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>; // ✅ เพิ่ม setTimer
    timerActive: boolean;
    toggleTimer: () => void;
    resetTimer: () => void;
    setTimerMinutes: (minutes: number) => void;
  }
  
  export interface RecipeHeaderProps {
    title: string;
    author: string;
    date: string;
    rating: number;
    comments: number;
    image_url: string;
    recipeId: number;
    userId: number;
    saved: boolean;
    setSaved: Dispatch<SetStateAction<boolean>>; // ✅ ใช้ Dispatch<SetStateAction<boolean>>
    liked: boolean;
    setLiked: Dispatch<SetStateAction<boolean>>; // ✅ ใช้ Dispatch<SetStateAction<boolean>>
  }
  
  
  

