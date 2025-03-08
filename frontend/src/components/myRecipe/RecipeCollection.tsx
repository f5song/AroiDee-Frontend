import React, { useState } from "react";
import { Recipe } from "@/lib/recipes/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import RecipeGrid from "@/components/common/RecipeGrid";
import { useFavorites } from "@/components/auth/FavoritesContext"; // ✅ ใช้ Context
import { useAuth } from "@/components/auth/AuthContext"; // ✅ ใช้ AuthContext

interface RecipeCollectionProps {
  myRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
}

const RecipeCollection: React.FC<RecipeCollectionProps> = ({
  myRecipes,
  favoriteRecipes,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("my-recipes");
  const { favorites, isProcessing, toggleFavorite } = useFavorites(); // ✅ ดึงค่า favorites จาก Context
  const { user } = useAuth();
  const isLoggedIn = !!user; // ✅ ตรวจสอบว่ามีการล็อกอินหรือไม่

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Tabs defaultValue="my-recipes" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="my-recipes" className="mt-4">
          <RecipeGrid
            recipes={myRecipes}
            loading={loading}
            favorites={favorites}
            isProcessing={isProcessing}
            onFavoriteToggle={toggleFavorite}
            isLoggedIn={isLoggedIn}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <RecipeGrid
            recipes={favoriteRecipes}
            loading={loading}
            favorites={favorites}
            isProcessing={isProcessing}
            onFavoriteToggle={toggleFavorite}
            isLoggedIn={isLoggedIn}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeCollection;
