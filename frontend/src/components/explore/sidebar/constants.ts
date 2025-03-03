import { Category } from "./types";

export const categories: Category[] = [
  { name: "All", slug: "all", icon: "🍽️", subcategories: [] },
  { name: "Cuisines", slug: "cuisines", icon: "🌍", subcategories: [
    { name: "Thai", slug: "thai", icon: "🇹🇭" },
    { name: "Italian", slug: "italian", icon: "🍝" },
    { name: "Mexican", slug: "mexican", icon: "🌮" },
  ] },
  { name: "Dietary", slug: "dietary", icon: "🥗", subcategories: [
    { name: "Vegetarian", slug: "vegetarian", icon: "🥬" },
    { name: "Vegan", slug: "vegan", icon: "🌱" },
    { name: "Gluten-Free", slug: "gluten-free", icon: "🚫🌾" },
    { name: "Keto", slug: "keto", icon: "🥓" },
  ] },
  { name: "Meal Type", slug: "meal-type", icon: "🍲", subcategories: [
    { name: "Breakfast", slug: "breakfast", icon: "🍳" },
    { name: "Lunch", slug: "lunch", icon: "🥪" },
    { name: "Dinner", slug: "dinner", icon: "🍽️" },
  ] },
  { name: "Special", slug: "special", icon: "⭐", subcategories: [
    { name: "Quick Meals", slug: "quick-meals", icon: "⏱️" },
    { name: "Kids Friendly", slug: "kids-friendly", icon: "👶" },
    { name: "Budget Friendly", slug: "budget-friendly", icon: "💸" },
  ] },
];