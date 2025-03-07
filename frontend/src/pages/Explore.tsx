import { useState, useEffect } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
import RecipeGrid from "@/components/explore/RecipeGrid";
import { NoResultsMessage } from "@/components/explore/FeedbackComponents";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  fetchRecipes, // ✅ ใช้แค่ fetchRecipes
} from "@/lib/recipes/api";

export default function ExplorePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: "all",
    search: "",
    sort: "rating",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0, // ✅ ป้องกัน undefined
  });

  // ✅ โหลดสูตรอาหารทั้งหมด (ไม่ต้องใช้ user)
  useEffect(() => {
    setLoading(true);
    const loadRecipes = async () => {
      try {
        console.log("🔍 Fetching recipes with filters:", filterOptions);
        const result = await fetchRecipes(filterOptions);
        console.log("✅ API Response:", result);

        // ✅ ป้องกัน `pagination` undefined
        setRecipes(result.recipes ?? []);
        setPagination(
          result.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0 }
        );
      } catch (error) {
        console.error("❌ Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [filterOptions]);

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
              totalItems={pagination.totalItems ?? 0} // ✅ ป้องกัน undefined
              sort={filterOptions.sort || "rating"}
              onSortChange={(sort) =>
                setFilterOptions((prev) => ({ ...prev, sort }))
              }
            />

            <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={[]} // ✅ ใส่ favorites เป็น array ว่าง (เพราะ Explore ไม่ต้องบันทึกสูตร)
              onFavoriteToggle={() => {}} // ✅ ส่งฟังก์ชันว่างไป เพื่อแก้ error
              isLoggedIn={false} // ✅ กำหนดค่า default
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
