import React, { useState, useEffect } from "react";
import { ChefHat, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ExploreSidebarProps} from "@/components/explore/sidebar/types";
import { categories } from "@/components/explore/sidebar/constants";
import SearchBar from "@/components/explore/sidebar/SearchBar";
import CategoryList from "@/components/explore/sidebar/CategoryList";
import ActiveFilters from "@/components/explore/sidebar/ActiveFilters";
import AdvancedFilters from "@/components/explore/sidebar/AdvancedFilters";
import SidebarCollapsible from "@/components/explore/sidebar/SidebarCollapsible";
import Tooltip from "@/components/explore/sidebar/Tooltip";

export function ExploreSidebar({
  onCategoryChange,
  onSearch,
  onAdvancedFiltersChange,
  onSidebarToggle, // เพิ่ม prop ใหม่สำหรับแจ้งสถานะ sidebar
}: ExploreSidebarProps & { onSidebarToggle?: (isOpen: boolean) => void }) {
  // State
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarHeight] = useState("auto");
  const [activeTab, setActiveTab] = useState("categories");
  
  // Advanced filters state
  const [cookingTime, setCookingTime] = useState(30);
  const [calorieRange, setCalorieRange] = useState(500);
  const [difficulty, setDifficulty] = useState("all");
  const [ingredients, setIngredients] = useState<string>("");
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Check if mobile on initial render and when window resizes
  useEffect(() => {
    function handleResize() {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // ในโหมดมือถือให้ปิด sidebar โดยค่าเริ่มต้น
      // ในโหมดเดสก์ท็อปให้เปิด sidebar โดยค่าเริ่มต้น
      if (window.innerWidth < 768) {
        setIsOpen(false); // มือถือปิด sidebar เสมอเมื่อเริ่มต้นหรือ resize
      } else if (window.innerWidth >= 768) {
        setIsOpen(true); // เดสก์ท็อปเปิด sidebar เสมอ
      }
    }
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // แจ้งสถานะ sidebar ไปยัง parent component
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isOpen);
    }
  }, [isOpen, onSidebarToggle]);

  // Find parent category
  const findParentCategory = (slug: string): string | null => {
    for (const category of categories) {
      const subcategory = category.subcategories.find(sub => sub.slug === slug);
      if (subcategory) return category.slug;
    }
    return null;
  };

  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (cookingTime !== 30) count++;
    if (calorieRange !== 500) count++;
    if (difficulty !== "all") count++;
    if (ingredientsList.length > 0) count++;
    setActiveFiltersCount(count);
  }, [cookingTime, calorieRange, difficulty, ingredientsList]);

  useEffect(() => {
    // Auto-expand parent category when subcategory is selected
    const parentSlug = findParentCategory(selectedCategory);
    if (parentSlug && !expandedCategories.includes(parentSlug)) {
      setExpandedCategories(prev => [...prev, parentSlug]);
    }
  }, [selectedCategory, expandedCategories]);

  // Simplified height management - just use auto height and let the browser handle it
  useEffect(() => {
    // Just make sure the navbar height is set correctly
    const navHeight = document.querySelector("header")?.offsetHeight || 0;
    document.documentElement.style.setProperty('--navbar-height', `${navHeight}px`);
  }, []);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    onCategoryChange(slug);
    
    // On mobile, close sidebar after selecting a category
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    
    // On mobile, close sidebar after search
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const handleAddIngredient = () => {
    if (ingredients.trim() && !ingredientsList.includes(ingredients.trim())) {
      setIngredientsList(prev => [...prev, ingredients.trim()]);
      setIngredients("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredientsList(prev => prev.filter(item => item !== ingredient));
  };

  const applyAdvancedFilters = () => {
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange({
        cookingTime,
        difficulty,
        ingredients: ingredientsList,
        calorieRange
      });
    }
    
    // On mobile, close sidebar after applying filters
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    onCategoryChange("all");
    setSearchQuery("");
    onSearch("");
    setCookingTime(30);
    setCalorieRange(500);
    setDifficulty("all");
    setIngredientsList([]);
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange({
        cookingTime: 30,
        difficulty: "all",
        ingredients: [],
        calorieRange: 500
      });
    }
  };

  // Render collapsed sidebar icons
  const renderCollapsedIcons = () => {
    return (
      <div className="flex flex-col items-center gap-5 max-h-screen">
        {categories.slice(0, 8).map((category) => ( // จำกัดจำนวนหมวดหมู่ที่แสดงหากมีมากเกินไป
          <Tooltip key={category.slug} content={category.name}>
            <Button
              variant={
                selectedCategory === category.slug || 
                (findParentCategory(selectedCategory) === category.slug) 
                  ? "secondary" 
                  : "ghost"
              }
              size="icon"
              className="w-10 h-10 flex items-center justify-center"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <span className="text-lg">{category.icon}</span>
            </Button>
          </Tooltip>
        ))}
      </div>
    );
  };

  return (
    <SidebarCollapsible
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isMobile={isMobile}
      sidebarHeight={sidebarHeight}
      selectedCategory={selectedCategory}
      activeFiltersCount={activeFiltersCount}
      searchQuery={searchQuery}
    >
      {!isOpen ? (
        // เมื่อ sidebar ถูกย่อ แสดงเฉพาะไอคอน
        renderCollapsedIcons()
      ) : (
        // เมื่อ sidebar ถูกขยาย แสดงเนื้อหาปกติ
        <>
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            handleSearch={handleSearch} 
          />
          
          <div className="p-4 overflow-y-auto flex-grow">
            <ActiveFilters 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              cookingTime={cookingTime}
              difficulty={difficulty}
              calorieRange={calorieRange}
              ingredientsList={ingredientsList}
              resetFilters={resetFilters}
              setSelectedCategory={setSelectedCategory}
              setSearchQuery={setSearchQuery}
              setCookingTime={setCookingTime}
              setDifficulty={setDifficulty}
              setCalorieRange={setCalorieRange}
              removeIngredient={removeIngredient}
              onCategoryChange={onCategoryChange}
              onSearch={onSearch}
              activeFiltersCount={activeFiltersCount}
            />
            
            <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="categories" className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="filters" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ml-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories" className="m-0">
                <CategoryList 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  expandedCategories={expandedCategories}
                  setExpandedCategories={setExpandedCategories}
                  handleCategoryClick={handleCategoryClick}
                />
              </TabsContent>
              
              <TabsContent value="filters" className="space-y-6 m-0">
                <AdvancedFilters 
                  cookingTime={cookingTime}
                  setCookingTime={setCookingTime}
                  difficulty={difficulty}
                  setDifficulty={setDifficulty}
                  ingredients={ingredients}
                  setIngredients={setIngredients}
                  ingredientsList={ingredientsList}
                  calorieRange={calorieRange}
                  setCalorieRange={setCalorieRange}
                  handleAddIngredient={handleAddIngredient}
                  removeIngredient={removeIngredient}
                  applyAdvancedFilters={applyAdvancedFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </SidebarCollapsible>
  );
}