import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DifficultySelectProps } from "@/components/explore/sidebar/types";

export function DifficultySelect({ difficulty, setDifficulty }: DifficultySelectProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium flex items-center">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        Difficulty Level
      </h3>
      <Select value={difficulty} onValueChange={setDifficulty}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default DifficultySelect;