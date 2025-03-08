import React, { useState, useEffect } from "react";
import { Recipe, FilterOptions } from "@/lib/recipes/types";
import { TAB_VALUES, SORT_OPTIONS } from "@/lib/recipes/constants";
import { fetchRecipesBySource } from "@/lib/recipes/api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PaginationControls from "@/components/explore/PaginationControls";
import NoResultsMessage from "@/components/explore/NoResultsMessage";
import TabsNavigation from "@/components/myRecipe/TabsNavigation";
import RecipeGrid from "@/components/common/RecipeGrid";
import EmptyState from "@/components/myRecipe/EmptyState";
import { useAuth } from "@/components/auth/AuthContext";

interface RecipeCollectionProps {
  myRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number, newState: boolean) => void;
  isLoggedIn: boolean;
}

const RecipeCollection: React.FC<RecipeCollectionProps> = ({
  myRecipes: initialMyRecipes,
  favoriteRecipes: initialFavoriteRecipes,
  loading: initialLoading,
  favorites,
  onFavoriteToggle,
  isLoggedIn,
}) => {
  // ✅ ดึงข้อมูลผู้ใช้
  const { user } = useAuth();

  // ✅ UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(TAB_VALUES.MY_RECIPES);
  const [sort, setSort] = useState(SORT_OPTIONS.LATEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories] = useState<string[]>([]);
  const [cookingTime] = useState<number | undefined>(undefined);
  const [difficulty] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({});
  const [totalPages, setTotalPages] = useState<number>(1);

  // ✅ ใช้ state สำหรับ myRecipes และอัปเดตจาก API
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>(favorites);

  // ✅ อัปเดต `myRecipes` และ `favoriteRecipeIds` เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    setMyRecipes(initialMyRecipes);
    setFavoriteRecipeIds(favorites);
  }, [initialMyRecipes, favorites]);

  // ✅ โหลดข้อมูลเมื่อผู้ใช้เปลี่ยนแท็บ / ค้นหา / เปลี่ยนตัวกรอง
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const filterOptions: FilterOptions = {
          search: searchQuery,
          sort: sort,
          page: currentPage,
          cookingTime: cookingTime,
          difficulty: difficulty,
          category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        };

        const response = await fetchRecipesBySource(
          activeTab === TAB_VALUES.MY_RECIPES ? "USER" : "FAVORITE",
          user.id,
          filterOptions
        );

        if (Array.isArray(response.recipes)) {
          setFilteredRecipes(response.recipes);
        } else {
          console.error("❌ response.recipes is not an array:", response.recipes);
          setFilteredRecipes([]);
        }

        setTotalPages(response.pagination.totalPages || 1);
      } catch (error) {
        console.error("Error fetching filtered recipes:", error);
        setFilteredRecipes([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredRecipes();
  }, [
    user,
    activeTab,
    searchQuery,
    sort,
    currentPage,
    cookingTime,
    difficulty,
    selectedCategories,
  ]);

  // ✅ ฟังก์ชันอัปเดต Favorite Recipes (Save/Unsave) และป้องกันกดซ้ำ
  const handleFavoriteToggle = async (recipeId: number, newState: boolean) => {
    if (isProcessing[recipeId]) return; // ✅ ป้องกันกดซ้ำ
    setIsProcessing((prev) => ({ ...prev, [recipeId]: true }));

    try {
      setFavoriteRecipeIds((prev) =>
        newState ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
      );
      await onFavoriteToggle(recipeId, newState);
    } finally {
      setTimeout(() => {
        setIsProcessing((prev) => ({ ...prev, [recipeId]: false }));
      }, 500); // ✅ ป้องกันกดซ้ำภายใน 0.5 วินาที
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <Tabs defaultValue={TAB_VALUES.MY_RECIPES} value={activeTab} onValueChange={setActiveTab}>
          <TabsNavigation
            activeTab={activeTab}
            searchQuery={searchQuery}
            sort={sort}
            onSearchChange={setSearchQuery}
            onSortChange={setSort}
            onSearch={() => setCurrentPage(1)}
          />

          <TabsContent value={TAB_VALUES.MY_RECIPES} className="mt-4">
            {!loading && myRecipes.length === 0 ? (
              <EmptyState type="my-recipes" />
            ) : (
              <RecipeGrid
                recipes={myRecipes}
                loading={loading}
                favorites={favoriteRecipeIds}
                isProcessing={isProcessing} // ✅ ส่งค่าไป RecipeGrid
                onFavoriteToggle={handleFavoriteToggle}
                isLoggedIn={isLoggedIn}
              />
            )}
          </TabsContent>

          <TabsContent value={TAB_VALUES.FAVORITES} className="mt-4">
            {!loading && initialFavoriteRecipes.length === 0 ? (
              <EmptyState type="favorites" />
            ) : filteredRecipes.length === 0 ? (
              <NoResultsMessage onReset={() => setSearchQuery("")} />
            ) : (
              <RecipeGrid
                recipes={filteredRecipes}
                loading={loading}
                favorites={favoriteRecipeIds}
                isProcessing={isProcessing} // ✅ ส่งค่าไป RecipeGrid
                onFavoriteToggle={handleFavoriteToggle}
                isLoggedIn={isLoggedIn}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {filteredRecipes.length > 0 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </>
  );
};

export default RecipeCollection;
