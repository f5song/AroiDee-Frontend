import { useState, useEffect, useMemo } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
// import RecipeGrid from "@/components/explore/RecipeGrid";
import NoResultsMessage from "@/components/explore/NoResultsMessage";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  fetchRecipes,
  // saveRecipe,
  // unsaveRecipe,
  getSavedRecipes,
} from "@/lib/recipes/api";
import { useAuth } from "@/components/auth/AuthContext"; // ✅ ดึง user จาก Context

/**
 * Main component for the Explore page
 */
export default function ExplorePage() {
  const { user } = useAuth(); // ดึง user จาก Context
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
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

  console.log(savedRecipes)
  // กำหนด isLoggedIn ตาม user
  // const isLoggedIn = !!user;

  // โหลดสูตรอาหารที่ถูกบันทึกโดย user
  useEffect(() => {
    if (!user) return;
  
    const fetchSavedRecipes = async () => {
      try {
        const result = await getSavedRecipes(user.id);
        setSavedRecipes(result.map((r: any) => r.recipe_id));
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      }
    };
  
    fetchSavedRecipes();
  }, [user]);

  // โหลดสูตรอาหาร
  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
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

  // // เพิ่ม/ลบสูตรอาหารจาก favorites
  // const handleFavorite = async (recipeId: number) => {
  //   if (!user) {
  //     console.error("User not logged in");
  //     return;
  //   }

  //   try {
  //     if (savedRecipes.includes(recipeId)) {
  //       await unsaveRecipe(user.id, recipeId);
  //       setSavedRecipes((prev) => prev.filter((id) => id !== recipeId));
  //     } else {
  //       await saveRecipe(user.id, recipeId);
  //       setSavedRecipes((prev) => [...prev, recipeId]);
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //   }
  // };

  const handleCategoryChange = (category: string) => {
    setFilterOptions((prev: FilterOptions) => ({ ...prev, category, page: 1 }));
  };
  
  const handleSearch = (search: string) => {
    setFilterOptions((prev: FilterOptions) => ({ ...prev, search, page: 1 }));
  };
  
  const handleSortChange = (sort: string) => {
    setFilterOptions((prev: FilterOptions) => ({ ...prev, sort }));
  };
  
  const handlePageChange = (page: number) => {
    setFilterOptions((prev: FilterOptions) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // รีเซ็ตตัวกรอง
  const handleResetFilters = () => {
    setFilterOptions({
      category: "all",
      search: "",
      sort: "rating",
      page: 1,
    });
  };

  // เช็คว่ามีสูตรอาหารหรือไม่
  const noResults = useMemo(
    () => !loading && recipes.length === 0,
    [loading, recipes]
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <ExploreSidebar
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
        />
        <main className="flex-1 p-4 md:p-6 ml-12 md:ml-0">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              totalItems={pagination.totalItems}
              sort={filterOptions.sort || "rating"}
              onSortChange={handleSortChange}
            />

            {/* <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={savedRecipes}
              onFavoriteToggle={handleFavorite}
              isLoggedIn={isLoggedIn} // ส่ง isLoggedIn ไปที่ RecipeGrid
            /> */}

            {noResults && <NoResultsMessage onReset={handleResetFilters} />}

            {!loading && recipes.length > 0 && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
