// Types for Recipe Data
export interface Nutrition {
    calories: string;
    protein: string;
    fat: string;
    carbs: string;
    sugar: string;
  }
  
  export interface RelatedRecipe {
    title: string;
    image: string;
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
    liked: boolean;
    saved: boolean;
    setLiked: React.Dispatch<React.SetStateAction<boolean>>;
    setSaved: React.Dispatch<React.SetStateAction<boolean>>;
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
    ingredients: string[];
    checkedIngredients: boolean[];
    handleIngredientClick: (index: number) => void;
    getConvertedIngredient: (ingredient: string) => string;
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
    getConvertedIngredient: (ingredient: string) => string;
    timer: number;
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