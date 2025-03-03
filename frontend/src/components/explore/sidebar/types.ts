export interface Category {
  name: string;
  slug: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  slug: string;
  icon: string;
}

export interface ExploreSidebarProps {
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  onAdvancedFiltersChange?: (filters: AdvancedFilters) => void;
}

export interface AdvancedFilters {
  cookingTime: number;
  difficulty: string;
  ingredients: string[];
  calorieRange: number; // Added calorieRange
}

export interface ActiveFiltersProps {
  selectedCategory: string;
  searchQuery: string;
  cookingTime: number;
  difficulty: string;
  ingredientsList: string[];
  calorieRange: number; // Added calorieRange
  resetFilters: () => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setCookingTime: (time: number) => void;
  setDifficulty: (difficulty: string) => void;
  setCalorieRange: (calories: number) => void; // Added setCalorieRange
  removeIngredient: (ingredient: string) => void;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  activeFiltersCount: number;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  expandedCategories: string[];
  setExpandedCategories: (categories: string[]) => void;
  handleCategoryClick: (slug: string) => void;
}

export interface CookingTimeSliderProps {
  cookingTime: number;
  setCookingTime: (time: number) => void;
}

export interface CalorieRangeSliderProps {
  calorieRange: number;
  setCalorieRange: (calories: number) => void;
}

export interface DifficultySelectProps {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

export interface IngredientInputProps {
  ingredients: string;
  setIngredients: (value: string) => void;
  ingredientsList: string[];
  handleAddIngredient: () => void;
  removeIngredient: (ingredient: string) => void;
}

export interface AdvancedFiltersProps {
  cookingTime: number;
  setCookingTime: (time: number) => void;
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
  ingredients: string;
  setIngredients: (value: string) => void;
  ingredientsList: string[];
  calorieRange: number; // Added calorieRange
  setCalorieRange: (calories: number) => void; // Added setCalorieRange
  handleAddIngredient: () => void;
  removeIngredient: (ingredient: string) => void;
  applyAdvancedFilters: () => void;
  activeFiltersCount: number;
}

export interface SidebarCollapsibleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  sidebarHeight: string;
  selectedCategory: string;
  activeFiltersCount: number;
  searchQuery: string;
  children: React.ReactNode;
}

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
}