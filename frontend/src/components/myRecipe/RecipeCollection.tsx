import React, { useState } from "react";
import { Recipe } from "@/lib/recipes/types";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import RecipeGrid from "@/components/common/RecipeGrid";

interface RecipeCollectionProps {
  myRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
  favorites: number[]; // ✅ เพิ่ม Favorites เพื่อควบคุม UI
  onFavoriteToggle: (id: number) => Promise<void>;
  isProcessing: Record<number, boolean>; // ✅ ป้องกันการกดซ้ำ
  isLoggedIn: boolean;
}

const RecipeCollection: React.FC<RecipeCollectionProps> = ({
  myRecipes,
  favoriteRecipes,
  loading,
  favorites,
  onFavoriteToggle,
  isProcessing,
  isLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState("my-recipes");

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <Tabs defaultValue="my-recipes" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="my-recipes" className="mt-4">
          <RecipeGrid 
            recipes={myRecipes} 
            loading={loading} 
            favorites={favorites}
            isProcessing={isProcessing}
            onFavoriteToggle={onFavoriteToggle} 
            isLoggedIn={isLoggedIn}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <RecipeGrid 
            recipes={favoriteRecipes} 
            loading={loading} 
            favorites={favorites}
            isProcessing={isProcessing}
            onFavoriteToggle={onFavoriteToggle} 
            isLoggedIn={isLoggedIn}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipeCollection;
