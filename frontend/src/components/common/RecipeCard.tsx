import { Heart, Clock, Star } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  isProcessing: boolean; // ✅ เพิ่ม isProcessing
  onFavoriteToggle: () => void;
}

export function RecipeCard({
  recipe,
  isFavorite,
  isProcessing, // ✅ รับค่าจาก RecipeGrid.tsx
  onFavoriteToggle,
}: RecipeCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ ป้องกันกดปุ่มซ้ำระหว่างรอ API
  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!user?.id) {
      navigate("/login");
      return;
    }
    if (isProcessing) return; // ✅ ถ้ากำลังโหลดอยู่ ห้ามกดซ้ำ
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
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-medium">{recipe.rating}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-2">
            {recipe.title}
          </CardTitle>
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.categories.map((category) => (
              <Badge
                key={category.id}
                variant="secondary"
                className="text-xs bg-green-50"
              >
                {category.name}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {recipe.cook_time} min
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cooking time</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{recipe.calories} cal</span>
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
                disabled={isProcessing} // ✅ ปิดการกดปุ่มระหว่าง API request
                className={isFavorite ? "bg-red-50" : "hover:bg-red-50"}
                onClick={handleFavoriteToggle}
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
                <Link to={`/recipe/${recipe.id}`}>View Recipe</Link>
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
