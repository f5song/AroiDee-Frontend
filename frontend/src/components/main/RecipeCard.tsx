import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart, Star, Heart } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  author: string;
  image_url?: string;
  cook_time?: number;
  calories?: number;
  rating?: number | null;
  ingredients: string[];
  isFavorite: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onToggleFavorite,
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col min-h-[420px]">
      {/* ✅ ป้องกัน null หรือ undefined */}
      <img
        src={recipe.image_url || "/default-recipe.jpg"}
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-semibold text-lg mb-1 line-clamp-1">
            {recipe.title}
          </h4>
          {/* ✅ ป้องกัน Unknown แสดงผลหาก author เป็น null หรือ undefined */}
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
            by {recipe.author || "Anonymous"}
          </p>

          <div className="flex flex-wrap gap-2 my-2 max-h-[40px] overflow-hidden">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <Badge key={i} variant="outline" className="bg-green-50">
                {ing}
              </Badge>
            ))}
            {recipe.ingredients.length > 3 && (
              <Badge variant="outline">+{recipe.ingredients.length - 3}</Badge>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />{" "}
            {recipe.cook_time ? `${recipe.cook_time} mins` : "N/A"}
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />{" "}
            {recipe.calories ? `${recipe.calories} kcal` : "N/A"}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-5 w-5" /> {recipe.rating ?? "N/A"}
          </div>
          <Button variant="outline" size="sm" onClick={onToggleFavorite}>
            <Heart
              className={`h-5 w-5 ${
                recipe.isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {recipe.isFavorite ? "Liked" : "Like"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
