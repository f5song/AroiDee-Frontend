import { Heart, Clock, ChefHat, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recipe } from "@/lib/recipes/types";
import { getTagColor } from "@/lib/recipes/utils";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

/**
 * Recipe card component displaying a single recipe
 */
export function RecipeCard({ recipe, isFavorite, onFavoriteToggle }: RecipeCardProps) {
  const { id, title, calories, time, image, rating, difficulty, tags } = recipe;
  
  // Show no more than 2 tags
  const displayTags = tags?.slice(0, 2) || [];

  return (
    <TooltipProvider>
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="p-0 relative">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
            {title}
          </CardTitle>

          <div className="flex flex-wrap gap-1 mb-2">
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`${getTagColor(tag)} text-xs`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {time} min
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cooking time</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center">
                  <ChefHat className="w-4 h-4 mr-1" /> {difficulty}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Difficulty level</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{calories} cal</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Calories per serving</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={isFavorite ? "bg-red-50" : "hover:bg-red-50"}
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteToggle();
                }}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-red-500"
                  }`}
                />
                {isFavorite ? "Saved" : "Save"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFavorite ? "Remove from favorites" : "Save this recipe"}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                size="sm"
                className="text-white bg-orange-500 hover:bg-orange-600"
              >
                <a href={`/recipe/${id}`}>View Recipe</a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View recipe details</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

export default RecipeCard;