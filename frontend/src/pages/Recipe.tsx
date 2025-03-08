import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../lib/api/recipeApi";

// Utils
import { convertIngredient } from "../utils/unitConverter";

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
    enabled: !!recipeId, // โหลดข้อมูลเมื่อ recipeId มีค่า
  });

  // ✅ เช็คว่า API ดึงข้อมูลสำเร็จหรือไม่
  useEffect(() => {
    console.log("📌 Recipe Data:", recipe);
  }, [recipe]);

  // ✅ แสดงข้อความโหลดข้อมูลหรือ error
  if (isLoading) return <p>🔄 กำลังโหลดข้อมูลสูตรอาหาร...</p>;
  if (error) return <p>❌ เกิดข้อผิดพลาด: {error.message}</p>;
  if (!recipe) return <p>⚠️ ไม่พบสูตรอาหาร</p>;

  // ✅ กำหนดค่าเริ่มต้นของ state ให้ปลอดภัย
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    Array(recipe.ingredients?.length || 0).fill(false)
  );
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList, setCommentsList] = useState<Comment[]>(
    recipe.comments || []
  );
  const [activeTab, setActiveTab] = useState<string>("ingredients");
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showNutritionDetails, setShowNutritionDetails] =
    useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("metric"); // metric or imperial

  // ✅ ตรวจสอบค่า recipe.instructions ว่ามีข้อมูลก่อนใช้งาน
  const nextStep = (): void => {
    if (recipe.instructions && currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ✅ ป้องกัน `undefined` ในส่วนของ `renderActiveTabContent`
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return (
          <IngredientsTab
            ingredients={recipe.ingredients || []}
            checkedIngredients={checkedIngredients}
            handleIngredientClick={(index) => {
              setCheckedIngredients((prev) => {
                const updated = [...prev];
                updated[index] = !updated[index];
                return updated;
              });
            }}
            getConvertedIngredient={(ingredient) =>
              convertIngredient(ingredient, selectedUnit)
            }
          />
        );
      case "instructions":
        return (
          <InstructionsTab
            instructions={recipe.instructions || []}
            toggleCookingMode={() => setCookingMode(!cookingMode)}
            setTimerMinutes={(minutes) => setTimer(minutes * 60)}
          />
        );
      case "comments":
        return (
          <CommentsTab
            commentsList={commentsList}
            newComment={newComment}
            setNewComment={setNewComment}
            handleCommentSubmit={() => {
              if (newComment.trim()) {
                setCommentsList((prev) => [
                  ...prev,
                  {
                    user: "Current User",
                    text: newComment,
                    date: new Date().toLocaleDateString(),
                  },
                ]);
                setNewComment("");
              }
            }}
          />
        );
      default:
        return <p>🔹 กรุณาเลือกแท็บ</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {cookingMode ? (
          <CookingModeView
            recipe={recipe}
            toggleCookingMode={() => setCookingMode(!cookingMode)}
            currentStep={currentStep}
            prevStep={prevStep}
            nextStep={nextStep}
            checkedIngredients={checkedIngredients}
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
              title={recipe?.title || "ไม่มีชื่อสูตร"}
              author={recipe?.author?.username || "ไม่ทราบผู้เขียน"}
              date={
                recipe?.created_at
                  ? new Date(recipe.created_at).toLocaleDateString()
                  : "ไม่ระบุวันที่"
              }
              rating={recipe?.rating || 0}
              comments={0}
              image_url={recipe?.image_url || "/default-recipe.jpg"}
              liked={liked} // ✅ เพิ่ม
              setLiked={setLiked} // ✅ เพิ่ม
              saved={saved}
              setSaved={setSaved}
            />

            {/* Control Bar */}
            <ControlBar
              toggleUnit={() =>
                setSelectedUnit(
                  selectedUnit === "metric" ? "imperial" : "metric"
                )
              }
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
              <div className="flex-grow order-2 lg:order-1">
                <TabContainer
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  commentCount={commentsList.length}
                >
                  {renderActiveTabContent()}
                </TabContainer>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-20 space-y-6">
                  {/* Nutrition Facts */}
                  <NutritionFacts
                    nutrition={recipe.nutrition_facts || {}}
                    showNutritionDetails={showNutritionDetails}
                    setShowNutritionDetails={setShowNutritionDetails}
                  />

                  {/* Related Recipes */}
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
