import { Button } from "@/components/ui/button";
import CookingTimeSlider from "@/components/explore/sidebar/CookingTimeSlider";
import CalorieRangeSlider from "@/components/explore/sidebar/CalorieRangeSlider";
import DifficultySelect from "@/components/explore/sidebar/DifficultySelect";
import IngredientInput from "@/components/explore/sidebar/IngredientInput";
import { AdvancedFiltersProps } from "@/components/explore/sidebar/types";

export function AdvancedFilters({
  cookingTime,
  setCookingTime,
  difficulty,
  setDifficulty,
  ingredients,
  setIngredients,
  ingredientsList,
  calorieRange,
  setCalorieRange,
  handleAddIngredient,
  removeIngredient,
  applyAdvancedFilters,
  activeFiltersCount,
}: AdvancedFiltersProps) {
  return (
    <div className="space-y-6">
      <CookingTimeSlider cookingTime={cookingTime} setCookingTime={setCookingTime} />
      
      <CalorieRangeSlider calorieRange={calorieRange} setCalorieRange={setCalorieRange} />
      
      <DifficultySelect difficulty={difficulty} setDifficulty={setDifficulty} />
      
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        ingredientsList={ingredientsList}
        handleAddIngredient={handleAddIngredient}
        removeIngredient={removeIngredient}
      />
      
      <Button 
        className="w-full mt-4" 
        onClick={applyAdvancedFilters}
      >
        Apply Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-white text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>
    </div>
  );
}

export default AdvancedFilters;