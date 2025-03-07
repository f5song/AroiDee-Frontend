import { useState, useEffect, useCallback } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
import RecipeGrid from "@/components/explore/RecipeGrid";
import NoResultsMessage from "@/components/explore/NoResultsMessage";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  fetchRecipes,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
} from "@/lib/recipes/api";
import { useAuth } from "@/components/auth/AuthContext";

export default function ExplorePage() {
  const { user } = useAuth(); // ดึง user จาก Context
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState<Set<number>>(new Set()); // ✅ เปลี่ยนเป็น Set เพื่อลดการคำนวณซ้ำ
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: "all",
    search: "",
    sort: "rating",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const isLoggedIn = !!user;

  // ✅ ใช้ useCallback ป้องกันการสร้างฟังก์ชันใหม่ในทุก re-render
  const fetchSavedRecipes = useCallback(async () => {
    if (!user) return;
    try {
      const result = await getSavedRecipes(user.id);
      setSavedRecipes(new Set(result.map((r: any) => r.recipe_id))); // ✅ ใช้ Set แทน Array
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedRecipes();
  }, [fetchSavedRecipes]);

  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        console.log("Fetching recipes..."); // ✅ Debugging
        const result = await fetchRecipes(filterOptions);
        setRecipes(result.recipes);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filterOptions]);

  // ✅ ใช้ useCallback ป้องกันไม่ให้ฟังก์ชันเปลี่ยนแปลงโดยไม่จำเป็น
  const handleFavorite = useCallback(
    async (recipeId: number) => {
      if (!user) {
        console.error("User not logged in");
        return;
      }

      try {
        if (savedRecipes.has(recipeId)) {
          await unsaveRecipe(user.id, recipeId);
          setSavedRecipes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(recipeId);
            return newSet;
          });
        } else {
          await saveRecipe(user.id, recipeId);
          setSavedRecipes((prev) => new Set(prev).add(recipeId));
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [user, savedRecipes]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <ExploreSidebar
          onCategoryChange={(category) =>
            setFilterOptions((prev) => ({ ...prev, category, page: 1 }))
          }
          onSearch={(search) =>
            setFilterOptions((prev) => ({ ...prev, search, page: 1 }))
          } // ✅ เพิ่ม onSearch
        />

        <main className="flex-1 p-4 md:p-6 ml-12 md:ml-0">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              totalItems={pagination.totalItems}
              sort={filterOptions.sort || "rating"}
              onSortChange={(sort) =>
                setFilterOptions((prev) => ({ ...prev, sort }))
              }
            />

            <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={Array.from(savedRecipes)} // ✅ แปลง Set กลับเป็น Array
              onFavoriteToggle={handleFavorite}
              isLoggedIn={isLoggedIn}
            />

            {recipes.length === 0 && !loading && (
              <NoResultsMessage
                onReset={() =>
                  setFilterOptions({
                    category: "all",
                    search: "",
                    sort: "rating",
                    page: 1,
                  })
                }
              />
            )}

            {!loading && recipes.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) =>
                  setFilterOptions((prev) => ({ ...prev, page }))
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
