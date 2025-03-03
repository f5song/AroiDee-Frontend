import { Flame } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { CalorieRangeSliderProps } from "@/components/explore/sidebar/types";

export function CalorieRangeSlider({ calorieRange, setCalorieRange }: CalorieRangeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <Flame className="h-4 w-4 mr-2" />
          Calories: {calorieRange} kcal or less
        </h3>
      </div>
      <Slider
        value={[calorieRange]}
        min={100}
        max={1000}
        step={50}
        onValueChange={(value) => setCalorieRange(value[0])}
        className="py-4"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>100 kcal</span>
        <span>500 kcal</span>
        <span>1000 kcal</span>
      </div>
    </div>
  );
}

export default CalorieRangeSlider;