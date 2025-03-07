import { Heart, Clock, Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/router";

interface RecipeCardProps {
  recipe: {
    id: number;
    description: string;
    title: string;
    calories: number;
    cook_time: number;
    image: string;
    rating: number;
    difficulty: string;
    categories: string[];
  };
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  isLoggedIn: boolean; // เพิ่ม prop สำหรับตรวจสอบสถานะล็อกอิน
}

export function RecipeCard({
  recipe,
  isFavorite,
  onFavoriteToggle,
  isLoggedIn, // รับค่าจาก prop
}: RecipeCardProps) {
  const { id, title, calories, cook_time, image, categories, rating } = recipe;
  const router = useRouter(); // ใช้ useRouter สำหรับการนำทางไปหน้า login

  const handleFavoriteToggle = async () => {
    if (!isLoggedIn) {
      // ถ้าผู้ใช้ยังไม่ได้ล็อกอิน ให้ redirect ไปหน้า login
      router.push("/login");
      return;
    }

    try {
      const user_id = 1; // สามารถเปลี่ยนให้ดึงจาก user ที่ล็อกอิน
      if (isFavorite) {
        // ถ้าเป็นสูตรที่บันทึกแล้วให้ยกเลิก
        await axios.post("https://aroi-dee-backend.vercel.app/api/saved-recipes/unsave-recipe", { user_id, recipe_id: id });
      } else {
        // ถ้ายังไม่ได้บันทึกให้ทำการบันทึก
        await axios.post("https://aroi-dee-backend.vercel.app/api/saved-recipes/save-recipe", { user_id, recipe_id: id });
      }
      onFavoriteToggle(); // เปลี่ยนสถานะ favorite
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

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
            <span className="text-sm font-medium">
              {rating}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
            {title}
          </CardTitle>
          <div className="flex flex-wrap gap-1 mb-2">
            {categories?.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs bg-green-50">
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {cook_time} min
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cooking time</p>
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
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : "text-red-500"}`}
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
