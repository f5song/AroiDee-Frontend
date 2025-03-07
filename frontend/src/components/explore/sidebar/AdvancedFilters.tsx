import { Button } from "@/components/ui/button";
import CookingTimeSlider from "@/components/explore/sidebar/CookingTimeSlider";
import CalorieRangeSlider from "@/components/explore/sidebar/CalorieRangeSlider";
import { AdvancedFiltersProps } from "@/components/explore/sidebar/types";

export function AdvancedFilters({
  cookingTime,
  setCookingTime,
  calorieRange,
  setCalorieRange,
  applyAdvancedFilters,
  resetFilters, // ✅ ใช้ resetFilters
  activeFiltersCount,
}: AdvancedFiltersProps) {
  return (
    <div className="space-y-6">
      <CookingTimeSlider cookingTime={cookingTime} setCookingTime={setCookingTime} />
      <CalorieRangeSlider calorieRange={calorieRange} setCalorieRange={setCalorieRange} />

      <div className="flex space-x-2">
        <Button className="w-1/2 mt-4" onClick={resetFilters}>
          Reset
        </Button>
        <Button className="w-1/2 mt-4" onClick={applyAdvancedFilters}>
          Apply Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-white text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AdvancedFilters;
