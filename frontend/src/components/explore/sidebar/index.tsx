import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExploreSidebarProps } from "@/components/explore/sidebar/types";
import SearchBar from "@/components/explore/sidebar/SearchBar";
import ActiveFilters from "@/components/explore/sidebar/ActiveFilters";
import AdvancedFilters from "@/components/explore/sidebar/AdvancedFilters";
import SidebarCollapsible from "@/components/explore/sidebar/SidebarCollapsible";
import {  Filter } from "lucide-react"; // ✅ เพิ่ม Filter เข้าไปที่ import

export function ExploreSidebar({
  onSearch,
  onAdvancedFiltersChange,
  onSidebarToggle,
}: ExploreSidebarProps & { onSidebarToggle?: (isOpen: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarHeight] = useState("auto");
  const [activeTab, setActiveTab] = useState("categories");

  const [cookingTime, setCookingTime] = useState(30);
  const [calorieRange, setCalorieRange] = useState(500);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    function handleResize() {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsOpen(!isMobileView);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isOpen);
    }
  }, [isOpen, onSidebarToggle]);

  useEffect(() => {
    let count = 0;
    if (cookingTime !== 30) count++;
    if (calorieRange !== 500) count++;
    setActiveFiltersCount(count);
  }, [cookingTime, calorieRange]);

  const applyAdvancedFilters = () => {
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange({
        cookingTime,
        calorieRange,
      });
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    onSearch("");
    setCookingTime(30);
    setCalorieRange(500);
    if (onAdvancedFiltersChange) {
      onAdvancedFiltersChange({ cookingTime: 30, calorieRange: 500 });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <SidebarCollapsible
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isMobile={isMobile}
      sidebarHeight={sidebarHeight}
      activeFiltersCount={activeFiltersCount}
      searchQuery={searchQuery}
    >
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />

      <div className="p-4 overflow-y-auto flex-grow">
        <ActiveFilters
          cookingTime={cookingTime}
          calorieRange={calorieRange}
          resetFilters={resetFilters}
          setCookingTime={setCookingTime}
          setCalorieRange={setCalorieRange}
          activeFiltersCount={activeFiltersCount}
        />

        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="filters">
              <Filter className="h-4 w-4" /> Filters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filters">
            <AdvancedFilters
              cookingTime={cookingTime}
              setCookingTime={setCookingTime}
              calorieRange={calorieRange}
              setCalorieRange={setCalorieRange}
              applyAdvancedFilters={applyAdvancedFilters}
              resetFilters={resetFilters}
              activeFiltersCount={activeFiltersCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarCollapsible>
  );
}

export default ExploreSidebar;
