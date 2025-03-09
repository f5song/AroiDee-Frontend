import React from "react";
import { 
  Search, 
  RefreshCw, 
  Filter, 
  PlusCircle, 
  ChefHat, 
  Heart,
  Bookmark,
  CookingPot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: "my-recipes" | "favorites" | "search" | "explore";
  hasFilters?: boolean;
  onClearFilters?: () => void;
  customMessage?: string;
  customTitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type,
  hasFilters = false,
  onClearFilters,
  customMessage,
  customTitle
}) => {
  // กำหนดค่าเริ่มต้นตามประเภท
  let icon = <Search className="w-8 h-8 text-orange-500" />;
  let title = "No recipes found!";
  let message = "We couldn't find any recipes matching your criteria.";
  let primaryAction = null;
  let secondaryAction = null;

  // กำหนดค่าตามประเภท
  switch (type) {
    case "my-recipes":
      icon = <ChefHat className="w-8 h-8 text-orange-500" />;
      title = "You haven't created any recipes yet";
      message = "Start building your collection by creating your first recipe";
      primaryAction = (
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          asChild
        >
          <Link to="/recipes/create">
            <PlusCircle className="w-4 h-4" /> 
            Create First Recipe
          </Link>
        </Button>
      );
      secondaryAction = (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          asChild
        >
          <Link to="/explore">
            <Search className="w-4 h-4" />
            Explore Recipes
          </Link>
        </Button>
      );
      break;

    case "favorites":
      icon = <Heart className="w-8 h-8 text-orange-500" />;
      title = "You haven't saved any favorite recipes yet";
      message = "Explore recipes and click the heart icon to save your favorites";
      primaryAction = (
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          asChild
        >
          <Link to="/explore">
            <Search className="w-4 h-4" />
            Explore Recipes
          </Link>
        </Button>
      );
      break;

    case "search":
      icon = <Search className="w-8 h-8 text-orange-500" />;
      title = "No recipes match your search";
      message = "Try changing your search terms or category to see other results";
      primaryAction = (
        <Button 
          onClick={onClearFilters}
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          View all recipes
        </Button>
      );
      break;

    case "explore":
      icon = <CookingPot className="w-8 h-8 text-orange-500" />;
      title = "No recipes found";
      message = "We couldn't find any recipes matching your current filters.";
      primaryAction = (
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onClearFilters}
        >
          <RefreshCw className="w-4 h-4" />
          Clear All Filters
        </Button>
      );
      secondaryAction = (
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Adjust Filters
        </Button>
      );
      break;
  }

  // ถ้ามีการกำหนดข้อความหรือหัวข้อแบบกำหนดเอง ให้ใช้ค่าที่กำหนด
  if (customTitle) title = customTitle;
  if (customMessage) message = customMessage;

  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-orange-100 rounded-full mb-4">
        {icon}
      </div>
      
      <h3 className="text-xl font-medium mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};

export default EmptyState;