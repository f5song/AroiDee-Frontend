// Types for recipe creation
export interface IngredientInput {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

export interface InstructionInput {
  id: number;
  text: string;
}

export interface RecipeInput {
  title: string;
  description: string;
  time: number;
  calories: number;
  difficulty: string;
  servings: number;
  image: string | null;
  tags: string[];
  ingredients: IngredientInput[];
  instructions: InstructionInput[];
}

// Default values
export const defaultIngredient: IngredientInput = {
  id: 1,
  name: "",
  amount: "",
  unit: ""
};

export const defaultInstruction: InstructionInput = {
  id: 1,
  text: ""
};

export const defaultRecipe: RecipeInput = {
  title: "",
  description: "",
  time: 30,
  calories: 300,
  difficulty: "medium",
  servings: 4,
  image: null,
  tags: [],
  ingredients: [defaultIngredient],
  instructions: [defaultInstruction]
};

// Units options
export const unitOptions = [
  { value: "", label: "None" },
  { value: "g", label: "grams (g)" },
  { value: "kg", label: "kilograms (kg)" },
  { value: "ml", label: "milliliters (ml)" },
  { value: "l", label: "liters (l)" },
  { value: "tsp", label: "teaspoon (tsp)" },
  { value: "tbsp", label: "tablespoon (tbsp)" },
  { value: "cup", label: "cup" },
  { value: "pinch", label: "pinch" },
  { value: "piece", label: "piece" },
  { value: "slice", label: "slice" },
  { value: "clove", label: "clove" },
  { value: "bunch", label: "bunch" },
  { value: "oz", label: "ounce (oz)" },
  { value: "lb", label: "pound (lb)" }
];

// Difficulty levels
export const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" }
];

// Mock function to save recipe data
export const saveRecipe = async (recipe: RecipeInput): Promise<{ success: boolean; id?: number; error?: string }> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful save
      resolve({
        success: true,
        id: Math.floor(Math.random() * 1000) + 100 // Generate a fake ID
      });
      
      // To simulate an error instead:
      // resolve({
      //   success: false,
      //   error: "Failed to save recipe"
      // });
    }, 1500); // Simulate network delay
  });
};