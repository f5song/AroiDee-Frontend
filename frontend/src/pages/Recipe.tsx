import React, { useState, useEffect } from "react";
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

// Types
import { Comment } from "../types/recipe";

const RecipePage: React.FC = () => {
  const { recipeId } = useParams();

  // ✅ ใช้ useQuery ดึงข้อมูลจาก API
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId as string),
    enabled: !!recipeId,
  });

  // ✅ Debug ข้อมูลที่ได้จาก API
  useEffect(() => {
    console.log("📌 Recipe Data:", recipe);
  }, [recipe]);

  // ✅ State สำหรับการทำงานในหน้า
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ingredients");
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showNutritionDetails, setShowNutritionDetails] = useState<boolean>(false);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("metric");

  // ✅ ตั้งค่า checkedIngredients เมื่อโหลดข้อมูล
  useEffect(() => {
    if (recipe?.ingredients) {
      setCheckedIngredients(Array(recipe.ingredients.length).fill(false));
    }
  }, [recipe]);

  // ✅ ฟังก์ชันสลับค่า Checkbox
  const handleIngredientClick = (index: number): void => {
    setCheckedIngredients((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      console.log("🔄 Updated checkedIngredients:", updated);
      return updated;
    });
  };

  if (isLoading) return <p>กำลังโหลดข้อมูลสูตรอาหาร...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error.message}</p>;
  if (!recipe) return <p>ไม่พบสูตรอาหาร</p>;

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
            checkedIngredients={checkedIngredients}
            handleIngredientClick={handleIngredientClick}
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
              title={recipe?.title || "ไม่มีชื่อสูตร"}
              author={recipe?.author?.username || "ไม่ทราบผู้เขียน"}
              date={
                recipe?.created_at
                  ? new Date(recipe.created_at).toLocaleDateString()
                  : "ไม่ระบุวันที่"
              }
              rating={recipe?.rating || 0}
              comments={commentsList.length}
              image_url={recipe?.image_url || "/default-recipe.jpg"}
              liked={liked}
              setLiked={setLiked}
              saved={saved}
              setSaved={setSaved}
            />

            {/* Control Bar */}
            <ControlBar
              toggleUnit={() =>
                setSelectedUnit(selectedUnit === "metric" ? "imperial" : "metric")
              }
              selectedUnit={selectedUnit}
              setShowAllergies={setShowAllergies}
              showAllergies={showAllergies}
              toggleCookingMode={() => setCookingMode(!cookingMode)}
            />

            {/* Allergy Information */}
            <AllergyInfo showAllergies={showAllergies} setShowAllergies={setShowAllergies} />

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-grow order-2 lg:order-1">
                <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} commentCount={commentsList.length}>
                  {activeTab === "ingredients" ? (
                    <IngredientsTab
                      ingredients={recipe?.ingredients || []}
                      checkedIngredients={checkedIngredients}
                      handleIngredientClick={handleIngredientClick}
                      getConvertedIngredient={(ingredient) => ingredient.name}
                    />
                  ) : activeTab === "instructions" ? (
                    <InstructionsTab
                      instructions={recipe.instructions || []}
                      toggleCookingMode={() => setCookingMode(!cookingMode)}
                      setTimerMinutes={(minutes) => setTimer(minutes * 60)}
                    />
                  ) : (
                    <CommentsTab commentsList={commentsList} newComment={newComment} setNewComment={setNewComment} handleCommentSubmit={() => {}} />
                  )}
                </TabContainer>
              </div>
              <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-20 space-y-6">
                  <NutritionFacts nutrition={recipe.nutrition_facts || {}} showNutritionDetails={showNutritionDetails} setShowNutritionDetails={setShowNutritionDetails} />
                  <RelatedRecipes recipes={recipe.related_recipes || []} />
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
