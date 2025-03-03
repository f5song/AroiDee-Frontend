// components/myRecipe/TabsNavigation.tsx
import React from "react";
import { Bookmark, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TAB_VALUES, SORT_OPTIONS } from "@/lib/recipes/constants";

interface TabsNavigationProps {
  activeTab: string;
  searchQuery: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({
  activeTab,
  searchQuery,
  sort,
  onSearchChange,
  onSortChange,
  onSearch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <TabsList className="mb-0">
        <TabsTrigger value={TAB_VALUES.MY_RECIPES} className="flex items-center">
          <Edit className="w-4 h-4 mr-2" /> My Recipes
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.FAVORITES} className="flex items-center">
          <Bookmark className="w-4 h-4 mr-2" /> Favorites
        </TabsTrigger>
      </TabsList>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <form onSubmit={onSearch} className="flex gap-2">
          <Input
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="text-sm min-w-[200px] w-full sm:w-auto"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SORT_OPTIONS.LATEST}>Newest First</SelectItem>
              <SelectItem value={SORT_OPTIONS.OLDEST}>Oldest First</SelectItem>
              <SelectItem value={SORT_OPTIONS.NAME_ASC}>Name (A-Z)</SelectItem>
              <SelectItem value={SORT_OPTIONS.NAME_DESC}>Name (Z-A)</SelectItem>
              <SelectItem value={SORT_OPTIONS.COOKING_TIME}>
                Cooking Time
              </SelectItem>
              <SelectItem value={SORT_OPTIONS.RATING}>
                Highest Rating
              </SelectItem>
              <SelectItem value={SORT_OPTIONS.CALORIES_LOW}>
                Lowest Calories
              </SelectItem>
              <SelectItem value={SORT_OPTIONS.CALORIES_HIGH}>
                Highest Calories
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TabsNavigation;