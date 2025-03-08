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

  // ✅ ใช้ state สำหรับ myRecipes และอัปเดตจาก API
  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
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

        setTotalItems(response.pagination.totalItems || 0);
        setTotalPages(response.pagination.totalPages || 1);
      } catch (error) {
        console.error("Error fetching filtered recipes:", error);
        setFilteredRecipes([]);
        setTotalItems(0);
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

  // ✅ ฟังก์ชันอัปเดต Favorite Recipes (Save/Unsave)
  const handleFavoriteToggle = (recipeId: number, newState: boolean) => {
    setFavoriteRecipeIds((prev) =>
      newState ? [...prev, recipeId] : prev.filter((id) => id !== recipeId)
    );
    onFavoriteToggle(recipeId, newState);
  };

  console.log("📢 Render myRecipes:", myRecipes);
  console.log("📢 Render filteredRecipes:", filteredRecipes);
  console.log("📢 Favorite Recipes:", favoriteRecipeIds);

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
              <>
                <div className="text-gray-600 text-sm text-center mb-3">
                  {totalItems > 0 && <div className="text-gray-600 text-sm text-center mb-3">{`Total Recipes Found: ${totalItems}`}</div>}
                </div>
                <RecipeGrid
                  recipes={myRecipes}
                  loading={loading}
                  favorites={favoriteRecipeIds}
                  onFavoriteToggle={handleFavoriteToggle}
                  isLoggedIn={isLoggedIn}

                />
              </>
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
