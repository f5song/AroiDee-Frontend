import React, { useState, useEffect } from "react";

// Data
import { recipe } from "../data/recipeData";

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
import CookingTools from "../components/recipe/CookingTools";
import RelatedRecipes from "../components/recipe/RelatedRecipes";
import CookingModeView from "../components/recipe/CookingModeView";

// Types
import { Comment } from "../types/recipe";

const RecipePage: React.FC = () => {
  // States
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    Array(recipe.ingredients.length).fill(false)
  );
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList, setCommentsList] = useState<Comment[]>(recipe.commentsList);
  const [activeTab, setActiveTab] = useState<string>("ingredients");
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showNutritionDetails, setShowNutritionDetails] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("metric"); // metric or imperial

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  // Handlers
  const handleIngredientClick = (index: number): void => {
    setCheckedIngredients((prev: boolean[]) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleCommentSubmit = (): void => {
    if (newComment.trim()) {
      setCommentsList((prev: Comment[]) => [
        ...prev,
        {
          user: "Current User",
          text: newComment,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setNewComment("");
    }
  };

  const toggleTimer = (): void => {
    setTimerActive(!timerActive);
  };

  const resetTimer = (): void => {
    setTimer(0);
    setTimerActive(false);
  };

  const setTimerMinutes = (minutes: number): void => {
    setTimer(minutes * 60);
    setTimerActive(true);
  };

  const toggleCookingMode = (): void => {
    setCookingMode(!cookingMode);
    // Reset to first step when entering cooking mode
    if (!cookingMode) {
      setCurrentStep(0);
    }
  };

  const nextStep = (): void => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleUnit = (): void => {
    setSelectedUnit(selectedUnit === "metric" ? "imperial" : "metric");
  };

  // Helper functions
  const getConvertedIngredient = (ingredient: string): string => {
    return convertIngredient(ingredient, selectedUnit);
  };

  // Render different content based on active tab
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "ingredients":
        return (
          <IngredientsTab 
            ingredients={recipe.ingredients}
            checkedIngredients={checkedIngredients}
            handleIngredientClick={handleIngredientClick}
            getConvertedIngredient={getConvertedIngredient}
          />
        );
      case "instructions":
        return (
          <InstructionsTab 
            instructions={recipe.instructions}
            toggleCookingMode={toggleCookingMode}
            setTimerMinutes={setTimerMinutes}
          />
        );
      case "comments":
        return (
          <CommentsTab 
            commentsList={commentsList}
            newComment={newComment}
            setNewComment={setNewComment}
            handleCommentSubmit={handleCommentSubmit}
          />
        );
      default:
        return <IngredientsTab 
          ingredients={recipe.ingredients}
          checkedIngredients={checkedIngredients}
          handleIngredientClick={handleIngredientClick}
          getConvertedIngredient={getConvertedIngredient}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {cookingMode ? (
          // Cooking Mode View
          <CookingModeView 
            recipe={recipe}
            toggleCookingMode={toggleCookingMode}
            currentStep={currentStep}
            prevStep={prevStep}
            nextStep={nextStep}
            checkedIngredients={checkedIngredients}
            handleIngredientClick={handleIngredientClick}
            getConvertedIngredient={getConvertedIngredient}
            timer={timer}
            timerActive={timerActive}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            setTimerMinutes={setTimerMinutes}
          />
        ) : (
          // Normal Recipe View
          <>
            {/* Hero Section */}
            <RecipeHeader 
              title={recipe.title}
              author={recipe.author}
              date={recipe.date}
              rating={recipe.rating}
              comments={recipe.comments}
              image={recipe.image}
              liked={liked}
              saved={saved}
              setLiked={setLiked}
              setSaved={setSaved}
            />

            {/* Control Bar */}
            <ControlBar 
              toggleUnit={toggleUnit}
              selectedUnit={selectedUnit}
              setShowAllergies={setShowAllergies}
              showAllergies={showAllergies}
              toggleCookingMode={toggleCookingMode}
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
                  commentCount={commentsList.length}
                >
                  {renderActiveTabContent()}
                </TabContainer>
              </div>

              {/* Right Column - Sidebar */}
              <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-20 space-y-6">
                  {/* Nutrition Facts */}
                  <NutritionFacts 
                    nutrition={recipe.nutrition}
                    showNutritionDetails={showNutritionDetails}
                    setShowNutritionDetails={setShowNutritionDetails}
                  />

                  {/* Cooking Tools */}
                  <CookingTools />

                  {/* Related Recipes */}
                  <RelatedRecipes recipes={recipe.freshRecipes} />
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