import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/components/auth/AuthContext";

interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface RecipeCardProps {
  recipe: {
    id: number;
    description: string;
    title: string;
    calories: number;
    cook_time: number;
    image_url: string;
    rating: number;
    difficulty: string;
    categories: Category[];
  };
  isFavorite: boolean;
  isProcessing: boolean;
  onFavoriteToggle: () => void;
}

export function RecipeCard({
  recipe,
  isFavorite,
  isProcessing,
  onFavoriteToggle,
}: RecipeCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (isProcessing) return;
    onFavoriteToggle();
  };

  return (
    <TooltipProvider>
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <CardHeader className="p-0 relative">
          <img
            src={recipe.image_url || "/placeholder.svg"}
            alt={recipe.title}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-2">{recipe.title}</CardTitle>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                className={isFavorite ? "bg-red-50" : "hover:bg-red-50"}
                onClick={handleFavoriteToggle}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : "text-red-500"}`} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFavorite ? "Remove from favorites" : "Save this recipe"}</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}

export default RecipeCard;
