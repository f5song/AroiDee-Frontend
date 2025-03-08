import { useState, useEffect } from "react";
import { ExploreSidebar } from "@/components/explore/sidebar";
import PageHeader from "@/components/explore/PageHeader";
import RecipeGrid from "@/components/common/RecipeGrid";
import { NoResultsMessage } from "@/components/explore/FeedbackComponents";
import PaginationControls from "@/components/explore/PaginationControls";
import {
  FilterOptions,
  Recipe,
  fetchRecipes,
  saveRecipe,
  unsaveRecipe,
} from "@/lib/recipes/api";
import { useAuth } from "@/components/auth/AuthContext";

export default function ExplorePage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<Record<number, boolean>>({});

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

  const isLoggedIn = !!user;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        console.log("🔄 Fetching recipes & favorites...");
        
        const [recipesData, favoritesData] = await Promise.all([
          fetchRecipes(filterOptions),
          fetch(`https://aroi-dee-backend.vercel.app/api/saved-recipes/${user.id}/saved-recipes`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.json()),
        ]);

        console.log("✅ API Response:", recipesData, favoritesData);

        setRecipes(recipesData.recipes);
        setPagination(recipesData.pagination);

        if (favoritesData.success) {
          setFavorites(favoritesData.savedRecipeIds || []);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, filterOptions]);

  const handleFavorite = async (recipeId: number) => {
    if (!user) return;
    if (isProcessing[recipeId]) return;

    setIsProcessing((prev) => ({ ...prev, [recipeId]: true }));

    try {
      if (favorites.includes(recipeId)) {
        await unsaveRecipe(user.id, recipeId);
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await saveRecipe(user.id, recipeId);
        setFavorites((prev) => [...prev, recipeId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setTimeout(() => {
        setIsProcessing((prev) => {
          const newProcessing = { ...prev };
          delete newProcessing[recipeId];
          return newProcessing;
        });
      }, 500);
    }
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
              onSortChange={(sort) => {
                setFilterOptions((prev) => ({ ...prev, sort, page: 1 }));
              }}
            />

            <RecipeGrid
              recipes={recipes}
              loading={loading}
              favorites={favorites}
              onFavoriteToggle={handleFavorite}
              isProcessing={isProcessing}
              isLoggedIn={isLoggedIn}
            />

            {recipes.length === 0 && !loading && (
              <NoResultsMessage
                onReset={() =>
                  setFilterOptions({
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
