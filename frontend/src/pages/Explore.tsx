import { useState, useEffect } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
import RecipeGrid from "@/components/common/RecipeGrid";
import PaginationControls from "@/components/explore/PaginationControls";
import { FilterOptions, Recipe, fetchRecipes } from "@/lib/recipes/api";
import { useAuth } from "@/components/auth/AuthContext";
import { useFavorites } from "@/components/auth/FavoritesContext"; // ✅ ใช้ Context

export default function ExplorePage() {
  const { user } = useAuth();
  const { favorites, isProcessing, toggleFavorite } = useFavorites(); // ✅ ใช้ฟังก์ชันจาก Context
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    sort: "rating",
    page: 1,
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("🔄 Fetching recipes...");
        const recipesData = await fetchRecipes(filterOptions);
        setRecipes(recipesData.recipes);
        setPagination(recipesData.pagination);
      } catch (error) {
        console.error("❌ Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions]);

  // กำหนดว่ามีการใช้ filters หรือไม่
  const hasFilters = !!filterOptions.search || !!filterOptions.category;

  // ฟังก์ชันล้าง filters
  const clearFilters = () => {
    setFilterOptions({
      search: "",
      sort: "rating",
      page: 1,
    });
  };

  // ✅ เช็คก่อนให้ Favorite ถ้ายังไม่ล็อกอินให้แจ้งเตือน
  // ✅ แก้ไขให้รองรับ async/await
  const handleFavoriteToggle = async (recipeId: number): Promise<void> => {
    if (!user) {
      alert("❌ กรุณาเข้าสู่ระบบเพื่อบันทึกสูตรอาหาร");
      return;
    }
    await toggleFavorite(recipeId); // ✅ ใช้ await เพื่อให้มันเป็น Promise<void>
  };

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
                setFilterOptions((prev) => ({ ...prev, sort, page: 1 }))
              }
            />

            <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle} // ✅ ใช้ฟังก์ชันเช็ค login
              isProcessing={isProcessing}
              isLoggedIn={!!user}
              hasFilters={hasFilters}
              onClearFilters={clearFilters}
            />

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
