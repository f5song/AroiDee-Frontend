// components/myRecipe/CategoryFilter.tsx
import React, { useState } from "react";
import { Tag, X, Filter, Clock, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/recipes/constants";
import { CategoryOption } from "@/lib/recipes/types";

interface CategoryFilterProps {
  selectedCategories: string[];
  cookingTime?: number;
  difficulty?: string;
  onCategoryToggle: (categoryId: string) => void;
  onClearCategories: () => void;
  onCookingTimeChange?: (time: number | undefined) => void;
  onDifficultyChange?: (difficulty: string | undefined) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  cookingTime,
  difficulty,
  onCategoryToggle,
  onClearCategories,
  onCookingTimeChange,
  onDifficultyChange,
}) => {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState<boolean>(false);
  
  // Group categories
  const cuisineCategories = CATEGORIES.filter(cat => cat.group === "cuisine");
  const mealCategories = CATEGORIES.filter(cat => cat.group === "meal");
  const dietCategories = CATEGORIES.filter(cat => cat.group === "diet");
  const typeCategories = CATEGORIES.filter(cat => cat.group === "type" || cat.group === "main-ingredient" || cat.group === "time");

  // Display selected tags
  const renderSelectedCategories = () => {
    if (selectedCategories.length === 0 && !cookingTime && !difficulty) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedCategories.map(catId => {
          const category = CATEGORIES.find(c => c.id === catId);
          if (!category) return null;
          
          // Map category names to English if needed
          const displayName = getCategoryDisplayName(category);
          
          return (
            <Badge 
              key={catId} 
              variant="secondary"
              className="px-2 py-1 flex items-center gap-1"
            >
              {displayName}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onCategoryToggle(catId)}
              />
            </Badge>
          );
        })}
        
        {cookingTime && (
          <Badge 
            variant="secondary"
            className="px-2 py-1 flex items-center gap-1"
          >
            ≤ {cookingTime} min
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onCookingTimeChange && onCookingTimeChange(undefined)}
            />
          </Badge>
        )}
        
        {difficulty && (
          <Badge 
            variant="secondary"
            className="px-2 py-1 flex items-center gap-1"
          >
            Difficulty: {difficulty}
            <X 
              className="h-3 w-3 cursor-pointer" 
              onClick={() => onDifficultyChange && onDifficultyChange(undefined)}
            />
          </Badge>
        )}
        
        {(selectedCategories.length > 0 || cookingTime || difficulty) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearCategories}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
    );
  };

  // Helper function to get English display names for categories
  const getCategoryDisplayName = (category: CategoryOption): string => {
    // Map Thai category names to English
    const categoryNameMap: Record<string, string> = {
      "อาหารไทย": "Thai Food",
      "อาหารอิตาเลียน": "Italian Food",
      "อาหารเม็กซิกัน": "Mexican Food",
      "อาหารเอเชีย": "Asian Food",
      "อาหารเช้า": "Breakfast",
      "อาหารกลางวัน": "Lunch",
      "อาหารเย็น": "Dinner",
      "ของหวาน": "Dessert",
      "มังสวิรัติ": "Vegetarian",
      "วีแกน": "Vegan",
      "ไร้กลูเตน": "Gluten-Free",
      "คีโต": "Keto",
      "อาหารเพื่อสุขภาพ": "Healthy",
      "ไก่": "Chicken",
      "เนื้อวัว": "Beef",
      "อาหารทะเล": "Seafood",
      "ไข่": "Eggs",
      "ข้าว": "Rice",
      "เส้น": "Noodles",
      "พาสต้า": "Pasta",
      "เผ็ด": "Spicy",
      "หวาน": "Sweet",
      "อาหารทำเร็ว": "Quick Meals"
    };

    // Use the English mapping if available, otherwise use the original id
    return categoryNameMap[category.name] || category.id;
  };

  // Create category group for dropdown menu
  const renderCategoryGroup = (categories: CategoryOption[], groupTitle: string) => (
    <>
      <DropdownMenuItem className="font-semibold p-2" disabled>
        {groupTitle}
      </DropdownMenuItem>
      {categories.map(category => (
        <DropdownMenuItem 
          key={category.id} 
          className="pl-4 cursor-pointer"
          onClick={() => onCategoryToggle(category.id)}
        >
          <span className="flex items-center gap-2">
            <input 
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              readOnly
            />
            {getCategoryDisplayName(category)}
          </span>
        </DropdownMenuItem>
      ))}
    </>
  );

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>Categories</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              {renderCategoryGroup(cuisineCategories, "Cuisine")}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              {renderCategoryGroup(mealCategories, "Meal Type")}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              {renderCategoryGroup(dietCategories, "Dietary Requirements")}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              {renderCategoryGroup(typeCategories, "Other")}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Difficulty filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              <span>Difficulty</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onDifficultyChange && onDifficultyChange("easy")}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={difficulty === "easy"}
                  readOnly
                />
                Easy
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onDifficultyChange && onDifficultyChange("medium")}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={difficulty === "medium"}
                  readOnly
                />
                Medium
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onDifficultyChange && onDifficultyChange("hard")}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={difficulty === "hard"}
                  readOnly
                />
                Hard
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cooking time filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Time</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onCookingTimeChange && onCookingTimeChange(15)}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={cookingTime === 15}
                  readOnly
                />
                ≤ 15 min
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onCookingTimeChange && onCookingTimeChange(30)}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={cookingTime === 30}
                  readOnly
                />
                ≤ 30 min
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onCookingTimeChange && onCookingTimeChange(45)}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={cookingTime === 45}
                  readOnly
                />
                ≤ 45 min
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onCookingTimeChange && onCookingTimeChange(60)}
            >
              <span className="flex items-center gap-2">
                <input 
                  type="radio"
                  checked={cookingTime === 60}
                  readOnly
                />
                ≤ 60 min
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Advanced filters */}
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </Button>
      </div>
      
      {renderSelectedCategories()}
    </div>
  );
};

export default CategoryFilter;