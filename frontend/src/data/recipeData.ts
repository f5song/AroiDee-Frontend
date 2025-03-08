import { RecipeData } from "../types/recipe";

// Mock recipe data
export const recipe: RecipeData = {
  title: "Strawberry Cream Cheesecake",
  author: "John Doe",
  date: "February 10, 2025",
  rating: 4.5,
  comments: 25,
  image_url: "/recipe.jpg",
  prepTime: "30 minutes",
  cookTime: "6 hours",
  difficulty: "Medium",
  ingredients: [
    "200g graham crackers",
    "100g melted butter",
    "500g cream cheese",
    "200ml whipping cream",
    "100g sugar",
    "Strawberries for topping",
  ],
  instructions: [
    "Crush the graham crackers and mix with melted butter.",
    "Press into a cake mold and chill for 30 minutes.",
    "Mix cream cheese with sugar until smooth.",
    "Whip the cream until stiff peaks form and fold into cheese mix.",
    "Pour onto crust and refrigerate for 6 hours.",
    "Top with strawberries and serve chilled.",
  ],
  nutrition: {
    calories: "320 kcal",
    protein: "5g",
    fat: "22g",
    carbs: "30g",
    sugar: "24g",
  },
  freshRecipes: [
    { title: "Spinach and Cheese Pasta", image: "/recipe2.jpg" },
    { title: "Perfect Fancy Glazed Donuts", image: "/recipe3.jpg" },
    { title: "Mighty Chewy Brownies", image: "/recipe4.jpg" },
  ],
  commentsList: [
    {
      user: "Johanna Doe",
      text: "Amazing recipe! My family loved it!",
      date: "Feb 5, 2025",
    },
    {
      user: "Qiu Xun",
      text: "Tried this and it was perfect!",
      date: "Feb 6, 2025",
    },
  ],
  id: undefined
};