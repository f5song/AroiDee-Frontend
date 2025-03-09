// components/common/NoRecipesFound.tsx
import React from "react";
import { Search, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoRecipesFoundProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

const NoRecipesFound: React.FC<NoRecipesFoundProps> = ({ 
  hasFilters = false,
  onClearFilters 
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-orange-100 rounded-full mb-4">
        <Search className="w-8 h-8 text-orange-500" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">
        No recipes found!
      </h3>
      
      {hasFilters ? (
        <>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any recipes matching your current filters. Try adjusting your filters or search criteria.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onClearFilters}
            >
              <RefreshCw className="w-4 h-4" />
              Clear All Filters
            </Button>
            
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Adjust Filters
            </Button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          Recipes you create or save as favorites will appear here.
        </p>
      )}
    </div>
  );
};

export default NoRecipesFound;