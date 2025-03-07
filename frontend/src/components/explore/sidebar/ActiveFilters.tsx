import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ActiveFiltersProps } from "@/components/explore/sidebar/types";

export function ActiveFilters({
  cookingTime,
  calorieRange,
  resetFilters,
  setCookingTime,
  setCalorieRange,
  activeFiltersCount,
}: ActiveFiltersProps) {
  if (activeFiltersCount === 0) return null; // ไม่ต้องแสดงหากไม่มีตัวกรองที่ใช้งานอยู่

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 text-xs">
          Reset All
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
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
      </div>
    </div>
  );
}

export default ActiveFilters;
