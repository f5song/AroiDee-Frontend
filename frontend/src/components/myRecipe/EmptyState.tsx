// components/myRecipe/EmptyState.tsx
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "my-recipes" | "favorites";
}

const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  if (type === "my-recipes") {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">👨‍🍳</div>
        <h3 className="text-xl font-medium mb-2">
          You haven't created any recipes yet
        </h3>
        <p className="text-gray-500 mb-4">
          Start building your collection by creating your first recipe
        </p>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <PlusCircle className="w-4 h-4 mr-2" /> Create First Recipe
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🔖</div>
      <h3 className="text-xl font-medium mb-2">
        You haven't saved any favorite recipes yet
      </h3>
      <p className="text-gray-500 mb-4">
        Explore recipes and click the heart icon to save your favorites
      </p>
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white"
        asChild
      >
        <a href="/explore">Explore Recipes</a>
      </Button>
    </div>
  );
};

export default EmptyState;