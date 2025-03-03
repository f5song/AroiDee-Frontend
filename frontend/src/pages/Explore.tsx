import { useState, useEffect, useMemo } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
import RecipeGrid from "@/components/explore/RecipeGrid";
import NoResultsMessage from "@/components/explore/NoResultsMessage";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  RecipeSource,
  fetchRecipesBySource,
  toggleFavoriteRecipe,
} from "@/lib/recipes";
import Navbar from "@/components/navigation";
import Footer from "@/components/footer";

/**
 * Main component for the Explore page
 */
export default function ExplorePage() {
  // State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
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

  // Load favorites when component mounts
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteRecipes");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
    }
  }, []);

  // Load recipes when filter options change
  useEffect(() => {
    const loadRecipes = async () => {
      setLoading(true);
      try {
        const result = await fetchRecipesBySource(
          RecipeSource.ALL,
          filterOptions
        );
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

  // Set navbar height CSS variable
  useEffect(() => {
    const navbar = document.querySelector("navbar");
    if (navbar && navbar instanceof HTMLElement) {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${navbar.offsetHeight}px`
      );
    }
  }, []);

  // Event handlers
  const handleCategoryChange = (category: string) => {
    setFilterOptions((prev) => ({ ...prev, category, page: 1 }));
  };

  const handleSearch = (search: string) => {
    setFilterOptions((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleSortChange = (sort: string) => {
    setFilterOptions((prev) => ({ ...prev, sort }));
  };

  const handlePageChange = (page: number) => {
    setFilterOptions((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFavorite = async (id: number) => {
    try {
      // Use updated API
      const result = await toggleFavoriteRecipe(id);

      if (result.success) {
        setFavorites((prev) =>
          prev.includes(id)
            ? prev.filter((recipeId) => recipeId !== id)
            : [...prev, id]
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleResetFilters = () => {
    setFilterOptions({
      category: "all",
      search: "",
      sort: "rating",
      page: 1,
    });
  };

  // Compute whether there are no results
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
            {/* Header with sorting options */}
            <PageHeader
              totalItems={pagination.totalItems}
              sort={filterOptions.sort || "rating"} // Provide a default value
              onSortChange={handleSortChange}
            />

            {/* Recipe Grid */}
            <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={favorites}
              onFavoriteToggle={handleFavorite}
            />

            {/* No Results Message */}
            {noResults && <NoResultsMessage onReset={handleResetFilters} />}

            {/* Pagination */}
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
