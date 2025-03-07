import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, X } from "lucide-react";
import { ActiveFiltersProps } from "@/components/explore/sidebar/types";
import { categories } from "@/components/explore/sidebar/constants";

export function ActiveFilters({
  selectedCategory,
  searchQuery,
  cookingTime,
  difficulty,
  calorieRange,
  ingredientsList,
  resetFilters,
  setSelectedCategory,
  setSearchQuery,
  setCookingTime,
  setDifficulty,
  setCalorieRange,
  removeIngredient,
  onCategoryChange,
  onSearch,
  activeFiltersCount
}: ActiveFiltersProps) {
  // If no active filters, don't render anything
  if (selectedCategory === "all" && !searchQuery && activeFiltersCount === 0) {
    return null;
  }
  
  // Find category or subcategory name by slug
  const findCategoryName = (slug: string): string => {
    // Check main categories
    const mainCategory = categories.find(c => c.slug === slug);
    if (mainCategory) return mainCategory.name;
    
    // Check subcategories
    for (const category of categories) {
      const subcategory = category.subcategories.find(s => s.slug === slug);
      if (subcategory) return subcategory.name;
    }
    
    return slug; // Fallback
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="h-7 text-xs"
        >
          <RefreshCw className="mr-1 h-3 w-3" />
          Reset All
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {selectedCategory !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            {findCategoryName(selectedCategory)}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedCategory("all");
                onCategoryChange("all");
              }}
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        )}
        
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            Search: {searchQuery}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        )}
        
        {cookingTime !== 30 && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            ≤ {cookingTime} min
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCookingTime(30)}
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        )}
        
        {calorieRange !== 500 && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            ≤ {calorieRange} kcal
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCalorieRange(500)}
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        )}
        
        {difficulty !== "all" && (
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            {difficulty}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDifficulty("all")}
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        )}
        
        {ingredientsList.map(ingredient => (
          <Badge key={ingredient} variant="secondary" className="flex items-center gap-1 text-xs">
            {ingredient}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => removeIngredient(ingredient)}
              className="h-4 w-4 p-0 ml-1"
            >
              <X className="h-2 w-2" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default ActiveFilters;