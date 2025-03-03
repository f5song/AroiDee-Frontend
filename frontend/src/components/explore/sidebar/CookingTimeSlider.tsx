import { Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { CookingTimeSliderProps } from "@/components/explore/sidebar/types";

export function CookingTimeSlider({ cookingTime, setCookingTime }: CookingTimeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Cooking Time: {cookingTime} min or less
        </h3>
      </div>
      <Slider
        value={[cookingTime]}
        min={5}
        max={120}
        step={5}
        onValueChange={(value) => setCookingTime(value[0])}
        className="py-4"
      />
    </div>
  );
}

export default CookingTimeSlider;