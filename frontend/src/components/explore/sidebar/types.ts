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
  calorieRange: number;
}

export interface ActiveFiltersProps {
  cookingTime: number;
  calorieRange: number;
  resetFilters: () => void;
  setCookingTime: (time: number) => void;
  setCalorieRange: (calories: number) => void;
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

export interface AdvancedFiltersProps {
  cookingTime: number;
  setCookingTime: (time: number) => void;
  calorieRange: number;
  setCalorieRange: (calories: number) => void;
  applyAdvancedFilters: () => void;
  resetFilters: () => void;
  activeFiltersCount: number;
}

export interface SidebarCollapsibleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  sidebarHeight: string;
  activeFiltersCount: number;
  searchQuery: string;
  children: React.ReactNode;
}

export interface TooltipProps {
  children: React.ReactNode;
  content: string;
}
