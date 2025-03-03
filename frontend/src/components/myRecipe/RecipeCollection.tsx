// components/myRecipe/RecipeCollection.tsx
import React, { useState, useEffect } from "react";
import { Recipe, RecipeSource, FilterOptions } from "@/lib/recipes/types";
import { RECIPES_PER_PAGE, TAB_VALUES, SORT_OPTIONS } from "@/lib/recipes/constants";
import { fetchRecipesBySource } from "@/lib/recipes/api";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PaginationControls from "@/components/explore/PaginationControls";
import NoResultsMessage from "@/components/explore/NoResultsMessage";
import TabsNavigation from "@/components/myRecipe/TabsNavigation";
import RecipeGrid from "@/components/myRecipe/RecipeGrid";
import EmptyState from "@/components/myRecipe/EmptyState";
import CategoryFilter from "@/components/myRecipe/CategoryFilter";

interface RecipeCollectionProps {
  myRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  loading: boolean;
  favorites: number[];
  onFavoriteToggle: (id: number) => void;
}

const RecipeCollection: React.FC<RecipeCollectionProps> = ({
  myRecipes: initialMyRecipes,
  favoriteRecipes: initialFavoriteRecipes,
  loading: initialLoading,
  favorites,
  onFavoriteToggle,
}) => {
  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(TAB_VALUES.MY_RECIPES);
  const [sort, setSort] = useState(SORT_OPTIONS.LATEST);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState<number | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  
  // Data state
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Load data when tab, filters, or sorting changes
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      setLoading(true);
      
      try {
        // Create filter options object
        const filterOptions: FilterOptions = {
          search: searchQuery,
          sort: sort,
          page: currentPage,
          cookingTime: cookingTime,
          difficulty: difficulty
        };
        
        // Add category if only one is selected
        if (selectedCategories.length === 1) {
          filterOptions.category = selectedCategories[0];
        }
        
        // Select recipe source based on active tab
        const source = activeTab === TAB_VALUES.MY_RECIPES 
          ? RecipeSource.USER 
          : RecipeSource.FAVORITE;
        
        // Call the updated API
        const response = await fetchRecipesBySource(source, filterOptions);
        
        setFilteredRecipes(response.recipes);
        setTotalItems(response.pagination.totalItems);
        setTotalPages(response.pagination.totalPages);
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
  }, [activeTab, selectedCategories, searchQuery, sort, currentPage, cookingTime, difficulty]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sort, activeTab, selectedCategories, cookingTime, difficulty]);

  // Change tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // Change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Add/remove category
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSort(SORT_OPTIONS.LATEST);
    setSelectedCategories([]);
    setCookingTime(undefined);
    setDifficulty(undefined);
    setCurrentPage(1);
  };

  // Calculate number of active filters
  const activeFiltersCount = (
    (searchQuery ? 1 : 0) + 
    selectedCategories.length + 
    (cookingTime ? 1 : 0) + 
    (difficulty ? 1 : 0)
  );

  // Select which initial data to use for each tab
  const initialRecipes = activeTab === TAB_VALUES.MY_RECIPES 
    ? initialMyRecipes 
    : initialFavoriteRecipes;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <Tabs
          defaultValue={TAB_VALUES.MY_RECIPES}
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <TabsNavigation 
            activeTab={activeTab}
            searchQuery={searchQuery}
            sort={sort}
            onSearchChange={setSearchQuery}
            onSortChange={setSort}
            onSearch={handleSearch}
          />

          {/* Category filter section */}
          <div className="mt-3 border-t pt-3">
            <CategoryFilter 
              selectedCategories={selectedCategories}
              cookingTime={cookingTime}
              difficulty={difficulty}
              onCategoryToggle={handleCategoryToggle}
              onClearCategories={handleResetFilters}
              onCookingTimeChange={setCookingTime}
              onDifficultyChange={setDifficulty}
            />
          </div>

          {/* Filter summary */}
          {activeFiltersCount > 0 && (
            <div className="text-sm text-gray-500 mb-3 mt-1">
              Showing results with {activeFiltersCount} filters ({totalItems} items)
              {activeFiltersCount > 0 && (
                <button 
                  className="text-orange-500 ml-2 hover:underline"
                  onClick={handleResetFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <TabsContent value={TAB_VALUES.MY_RECIPES} className="mt-4">
            {!loading && initialMyRecipes.length === 0 ? (
              <EmptyState type="my-recipes" />
            ) : filteredRecipes.length === 0 && activeFiltersCount > 0 ? (
              <NoResultsMessage onReset={handleResetFilters} />
            ) : (
              <RecipeGrid
                recipes={filteredRecipes}
                loading={loading}
                favorites={favorites}
                onFavoriteToggle={onFavoriteToggle}
              />
            )}
          </TabsContent>

          <TabsContent value={TAB_VALUES.FAVORITES} className="mt-4">
            {!loading && initialFavoriteRecipes.length === 0 ? (
              <EmptyState type="favorites" />
            ) : filteredRecipes.length === 0 && activeFiltersCount > 0 ? (
              <NoResultsMessage onReset={handleResetFilters} />
            ) : (
              <RecipeGrid
                recipes={filteredRecipes}
                loading={loading}
                favorites={favorites}
                onFavoriteToggle={onFavoriteToggle}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Show pagination when there are results */}
      {filteredRecipes.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default RecipeCollection;