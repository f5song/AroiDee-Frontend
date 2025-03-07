import { useState, useEffect } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
// import RecipeGrid from "@/components/explore/RecipeGrid";
import { NoResultsMessage } from "@/components/explore/FeedbackComponents";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  fetchRecipes,
  // saveRecipe,
  // unsaveRecipe,
  getSavedRecipes,
} from "@/lib/recipes/api";
import { useAuth } from "@/components/auth/AuthContext";

export default function ExplorePage() {
  const { user } = useAuth(); // ดึงข้อมูล user จาก Context
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorites] = useState<number[]>([]);
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

  console.log(favorite)

  // const isLoggedIn = !!user; // ตรวจสอบว่ามีการล็อกอินหรือไม่

  // โหลดข้อมูลสูตรที่ถูกบันทึกเมื่อ component ถูกโหลด
  useEffect(() => {
    if (!user) return;
    
    const fetchSavedRecipes = async () => {
      try {
        const result = await getSavedRecipes(user.id);
        setFavorites(result.map((r: any) => r.recipe_id));
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  // โหลดสูตรอาหาร
  useEffect(() => {
    setLoading(true);
    const loadRecipes = async () => {
      try {
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

  // กดบันทึก / ยกเลิกบันทึกสูตรอาหาร
  // const handleFavorite = async (recipeId: number) => {
  //   if (!user) {
  //     console.warn("User not logged in");
  //     return;
  //   }

  //   try {
  //     if (favorites.includes(recipeId)) {
  //       await unsaveRecipe(user.id, recipeId);
  //       setFavorites((prev) => prev.filter((id) => id !== recipeId));
  //     } else {
  //       await saveRecipe(user.id, recipeId);
  //       setFavorites((prev) => [...prev, recipeId]);
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <ExploreSidebar
          onCategoryChange={(category) =>
            setFilterOptions((prev) => ({ ...prev, category, page: 1 }))
          }
          onSearch={(search) =>
            setFilterOptions((prev) => ({ ...prev, search, page: 1 }))
          }
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

            {/* <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={favorites}
              onFavoriteToggle={handleFavorite}
              isLoggedIn={isLoggedIn} // ✅ เพิ่มค่า isLoggedIn ที่ถูกต้อง
            /> */}

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
