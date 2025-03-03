import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart, Star, Heart } from "lucide-react";

interface Recipe {
  title: string;
  author: string;
  image: string;
  cookTime: string;
  calories: number;
  rating: number;
  ingredients: string[];
  isFavorite: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onToggleFavorite }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col min-h-[420px]">
      {/* Recipe Image */}
      <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />

      {/* Recipe Details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-semibold text-lg mb-1 line-clamp-1">{recipe.title}</h4>
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">by {recipe.author}</p>

          {/* Ingredients (Fixed Height) */}
          <div className="flex flex-wrap gap-2 my-2 max-h-[40px] overflow-hidden">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <Badge key={i} variant="outline" className="bg-green-50">{ing}</Badge>
            ))}
            {recipe.ingredients.length > 3 && (
              <Badge variant="outline">+{recipe.ingredients.length - 3}</Badge>
            )}
          </div>
        </div>

        {/* Cook Time & Calories */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {recipe.cookTime}</div>
          <div className="flex items-center gap-1"><BarChart className="h-4 w-4" /> {recipe.calories} kcal</div>
        </div>

        {/* Rating & Favorite Button */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-5 w-5" /> {recipe.rating}
          </div>
          <Button variant="outline" size="sm" onClick={onToggleFavorite}>
            <Heart className={`h-5 w-5 ${recipe.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            {recipe.isFavorite ? "Liked" : "Like"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
