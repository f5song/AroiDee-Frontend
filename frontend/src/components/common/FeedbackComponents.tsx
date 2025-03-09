import { 
  Search, 
  RefreshCw, 
  PlusCircle, 
  ChefHat, 
  Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Message shown when no recipes match the search criteria
 */
export function NoResultsMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-orange-100 rounded-full mb-4">
        <Search className="w-8 h-8 text-orange-500" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">
        No recipes match your search
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Try changing your search terms or category to see other results
      </p>
      
      <Button 
        onClick={onReset}
        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        View all recipes
      </Button>
    </div>
  );
}

/**
 * Empty state component for My Recipes and Favorites
 */
export function EmptyState({ type }: { type: "my-recipes" | "favorites" }) {
  if (type === "my-recipes") {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
        <div className="inline-flex justify-center items-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <ChefHat className="w-8 h-8 text-orange-500" />
        </div>
        
        <h3 className="text-xl font-medium mb-2">
          You haven't created any recipes yet
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Start building your collection by creating your first recipe
        </p>
        
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> 
          Create First Recipe
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12 px-4 bg-white rounded-lg shadow-sm">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-orange-100 rounded-full mb-4">
        <Heart className="w-8 h-8 text-orange-500" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">
        You haven't saved any favorite recipes yet
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Explore recipes and click the heart icon to save your favorites
      </p>
      
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
        asChild
      >
        <Link to="/explore">
          <Search className="w-4 h-4" />
          Explore Recipes
        </Link>
      </Button>
    </div>
  );
}

/**
 * Loading skeleton for recipe card
 */
export function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

/**
 * Component for showing multiple recipe card skeletons
 */
export function RecipeSkeletons({ count = 8 }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <RecipeCardSkeleton key={i} />
        ))}
    </div>
  );
}