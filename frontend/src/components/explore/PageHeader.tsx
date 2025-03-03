import { SortAsc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS_LIST } from "@/lib/recipes/constants";

interface PageHeaderProps {
  totalItems: number;
  sort?: string;
  onSortChange: (sort: string) => void;
}

/**
 * Page header component with title and sorting controls
 */
export default function PageHeader({ totalItems, sort, onSortChange }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">🍽️ Discover New Recipes</h1>
        <p className="text-gray-500">
          {totalItems > 0
            ? `Found ${totalItems} interesting recipes`
            : "No recipes match your search"}
        </p>
      </div>

      <div className="mt-4 md:mt-0 flex items-center">
        <label className="mr-2 text-sm font-medium flex items-center">
          <SortAsc className="w-4 h-4 mr-1" /> Sort by:
        </label>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose sorting" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS_LIST.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value === "latest" ? "Newest First" : 
                 option.value === "oldest" ? "Oldest First" : 
                 option.value === "name-asc" ? "Name (A-Z)" : 
                 option.value === "name-desc" ? "Name (Z-A)" :
                 option.value === "cooking-time" ? "Cooking Time" :
                 option.value === "rating" ? "Highest Rating" :
                 option.value === "calories-low" ? "Lowest Calories" : 
                 option.value === "calories-high" ? "Highest Calories" : 
                 option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

