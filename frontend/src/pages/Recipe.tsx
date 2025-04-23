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

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app"; // Default URL ถ้าไม่มีค่าใน .env

const RecipePage: React.FC = () => {
  const { recipeId } = useParams();

  // Fetch the current recipe
  const {
    data: recipe = {},
    isLoading, // ✅ เอา isLoading จาก react-query มาใช้
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId as string),
    enabled: !!recipeId,
  });

  // Debug data from API
  useEffect(() => {
    console.log("📌 Recipe Data:", recipe);
  }, [recipe]);

  // State for page functionality
  const [saved, setSaved] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [commentsList] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ingredients");
  const [cookingMode, setCookingMode] = useState<boolean>(false);
  const [showNutritionDetails, setShowNutritionDetails] =
    useState<boolean>(false);
  const [showAllergies, setShowAllergies] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<string>("metric");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Timer control functions
  const setTimerMinutes = (minutes: number) => {
    setTimer(minutes);
  };

  const toggleTimer = () => {
    setTimerActive((prev) => !prev);
  };

  const resetTimer = () => {
    setTimer(0);
    setTimerActive(false);
  };

  // Fetch all recipes from API
  const { data: allRecipes = [] } = useQuery<
    {
      id: number;
      title: string;
      image_url?: string;
      cook_time?: number;
      rating?: number;
    }[]
  >({
    queryKey: ["allRecipes"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/recipes`);
      const data = await res.json();
      return data.data || [];
    },
  });

  // Function to get random recipes that are different from the current recipe
  const getRandomRecipes = (
    allRecipes: {
      id: number;
      title: string;
      image_url?: string;
      cook_time?: number;
      rating?: string | number;
    }[],
    currentRecipeId: string | number,
    count: number = 5
  ): {
    id: number;
    title: string;
    image_url?: string;
    cook_time?: number;
    rating?: number;
  }[] => {
    if (!allRecipes.length) return [];

    const filteredRecipes = allRecipes.filter(
      (r) => r.id !== Number(currentRecipeId)
    );

    const shuffled = filteredRecipes.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, count).map((recipe) => ({
      ...recipe,
      rating: recipe.rating ? Number(recipe.rating) : 0,
    }));
  };

  // Convert recipeId to number and set default to 0 if undefined
  const parsedRecipeId = Number(recipeId ?? 0);

  // Get 5 random related recipes
  const relatedRecipes: {
    id: number;
    title: string;
    image_url?: string;
    cook_time?: number;
    rating?: number;
  }[] = getRandomRecipes(allRecipes, parsedRecipeId, 5);

  // Set checkedIngredients when data is loaded
  useEffect(() => {
    if (Array.isArray(recipe?.ingredients) && recipe.ingredients.length > 0) {
      setCheckedIngredients(Array(recipe.ingredients.length).fill(false));
    }
  }, [recipe?.ingredients]);

  // Function to toggle checkbox
  const handleIngredientClick = (index: number): void => {
    setCheckedIngredients((prev = []) => {
      const updated = [...prev];
      if (index >= 0 && index < updated.length) {
        updated[index] = !updated[index];
      }
      return updated;
    });
  };

  const nextStep = () => {
    if (
      recipe?.instructions?.length &&
      currentStep < recipe.instructions.length - 1
    ) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {cookingMode ? (
          <CookingModeView
            recipe={recipe}
            toggleCookingMode={() => setCookingMode(false)}
            currentStep={currentStep}
            prevStep={prevStep}
            nextStep={nextStep}
            checkedIngredients={checkedIngredients}
            handleIngredientClick={handleIngredientClick}
            getConvertedIngredient={(ingredient) => {
              if (
                typeof ingredient === "object" &&
                ingredient !== null &&
                "name" in ingredient &&
                "quantity" in ingredient &&
                "unit" in ingredient
              ) {
                return `${ingredient.name} - ${ingredient.quantity} ${ingredient.unit}`;
              }
              return "Ingredient data is incorrect";
            }}
            timer={timer}
            setTimer={setTimer}
            timerActive={timerActive}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            setTimerMinutes={setTimerMinutes}
          />
        ) : (
          <>
            {/* Hero Section */}
            <RecipeHeader
              isLoading={isLoading}
              title={recipe?.title || "No Recipe Name"}
              author={recipe?.author?.username || "Unknown Author"}
              date={
                recipe?.created_at
                  ? new Date(recipe.created_at).toLocaleDateString()
                  : "No Date"
              }
              rating={recipe?.rating || 0}
              comments={commentsList.length}
              image_url={recipe?.image_url || "/default-recipe.jpg"}
              recipeId={recipe?.id || 0}
              userId={user?.id || 0}
              saved={saved}
              setSaved={setSaved}
              liked={liked}
              setLiked={setLiked}
              token={user?.token || ""} // ✅ เพิ่ม token
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
                  {activeTab === "ingredients" ? (
                    <IngredientsTab
                      ingredients={recipe?.ingredients || []}
                      checkedIngredients={checkedIngredients}
                      handleIngredientClick={handleIngredientClick}
                      getConvertedIngredient={(ingredient) => ingredient.name}
                      isLoading={isLoading}
                    />
                  ) : activeTab === "instructions" ? (
                    <InstructionsTab
                      instructions={recipe?.instructions || []}
                      toggleCookingMode={() => setCookingMode(!cookingMode)}
                      setTimerMinutes={(minutes) => setTimer(minutes * 60)}
                      isLoading={isLoading}
                    />
                  ) : (
                    <CommentsTab
                      commentsList={commentsList}
                      newComment={newComment}
                      setNewComment={setNewComment}
                      handleCommentSubmit={() => {}}
                    />
                  )}
                </TabContainer>
              </div>
              <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
                <div className="lg:sticky lg:top-20 space-y-6">
                  {/* Fixed the nutrition_facts error here */}
                  <NutritionFacts
                    nutrition={recipe?.nutrition_facts || {}}
                    showNutritionDetails={showNutritionDetails}
                    setShowNutritionDetails={setShowNutritionDetails}
                    isLoading={isLoading}
                  />
                  <RelatedRecipes 
                  recipes={relatedRecipes}
                  isLoading={isLoading} />
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
