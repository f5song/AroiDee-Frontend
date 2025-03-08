import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../lib/api/recipeApi";


// Components
import RecipeHeader from "../components/recipe/RecipeHeader";
import ControlBar from "../components/recipe/ControlBar";
import AllergyInfo from "../components/recipe/AllergyInfo";
import IngredientsTab from "../components/recipe/IngredientsTab";
import InstructionsTab from "../components/recipe/InstructionsTab";
import CommentsTab from "../components/recipe/CommentsTab";
import TabContainer from "../components/ui/TabContainer";
import NutritionFacts from "../components/recipe/NutritionFacts";
import RelatedRecipes from "../components/recipe/RelatedRecipes";
import CookingModeView from "../components/recipe/CookingModeView";


const RecipePage: React.FC = () => {
  const { recipeId } = useParams(); // ดึงค่า recipeId จาก URL

  // ใช้ React Query ดึงข้อมูลสูตรอาหาร
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId as string),
    enabled: !!recipeId,
  });

  // กำหนดค่า State
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("ingredients");
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showNutritionDetails, setShowNutritionDetails] = useState<boolean>(false);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("metric"); // metric or imperial

  // ตรวจสอบสถานะการโหลดข้อมูล
  if (isLoading) return <p>กำลังโหลด...</p>;
  if (error) return <p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {cookingMode ? (
          <CookingModeView 
            recipe={recipe}
            toggleCookingMode={() => setCookingMode(!cookingMode)}
            currentStep={0}
            prevStep={() => {}}
            nextStep={() => {}}
            checkedIngredients={[]}
            handleIngredientClick={() => {}}
            getConvertedIngredient={() => ""}
            timer={timer}
            timerActive={timerActive}
            toggleTimer={() => setTimerActive(!timerActive)}
            resetTimer={() => setTimer(0)}
            setTimerMinutes={(minutes) => setTimer(minutes * 60)}
          />
        ) : (
          <>
            {/* Hero Section */}
            <RecipeHeader 
              title={recipe.title}
              author={recipe.user?.username || "Unknown"} // ดึงชื่อผู้ใช้
              date={new Date(recipe.created_at).toLocaleDateString()}
              rating={recipe.rating || 0}
              comments={recipe.saved_recipes.length || 0} // ใช้จำนวน saved_recipes เป็นจำนวนรีวิว
              image_url={recipe.image_url || "/default-recipe.jpg"}
              liked={liked}
              saved={saved}
              setLiked={setLiked}
              setSaved={setSaved}
            />

            {/* Control Bar */}
            <ControlBar 
              toggleUnit={() => setSelectedUnit(selectedUnit === "metric" ? "imperial" : "metric")}
              selectedUnit={selectedUnit}
              setShowAllergies={setShowAllergies}
              showAllergies={showAllergies}
              toggleCookingMode={() => setCookingMode(!cookingMode)}
            />

            {/* Allergy Information */}
            <AllergyInfo 
              showAllergies={showAllergies}
              setShowAllergies={setShowAllergies}
            />

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Main Content */}
              <div className="flex-grow order-2 lg:order-1">
                {/* Tabs Container */}
                <TabContainer 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  commentCount={recipe.saved_recipes.length || 0}
                >
                  {activeTab === "ingredients" ? (
                    <IngredientsTab 
                      ingredients={recipe.recipe_ingredients}
                      checkedIngredients={[]}
                      handleIngredientClick={() => {}}
                      getConvertedIngredient={() => ""}
                    />
                  ) : activeTab === "instructions" ? (
                    <InstructionsTab 
                      instructions={recipe.instructions}
                      toggleCookingMode={() => setCookingMode(!cookingMode)}
                      setTimerMinutes={(minutes) => setTimer(minutes * 60)}
                    />
                  ) : (
                    <CommentsTab 
                      commentsList={[]} // ปรับให้เป็น comment list จริงจาก API ภายหลัง
                      newComment=""
                      setNewComment={() => {}}
                      handleCommentSubmit={() => {}}
                    />
                  )}
                </TabContainer>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-20 space-y-6">
                  {/* Nutrition Facts */}
                  <NutritionFacts 
                    nutrition={recipe.nutrition_facts}
                    showNutritionDetails={showNutritionDetails}
                    setShowNutritionDetails={setShowNutritionDetails}
                  />

                  {/* Related Recipes */}
                  <RelatedRecipes recipes={[]} /> {/* ใช้ API ภายหลัง */}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default RecipePage;
