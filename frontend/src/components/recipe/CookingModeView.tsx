import React, { useState } from "react";
import { ChefHat, ArrowLeft, ArrowRight, Clock, X, Check, Info } from "lucide-react";
import { CookingModeViewProps } from "../../types/recipe";
import Timer from "./Timer";

const CookingModeView: React.FC<CookingModeViewProps> = ({
  recipe,
  toggleCookingMode,
  currentStep,
  prevStep,
  nextStep,
  checkedIngredients,
  handleIngredientClick,
  getConvertedIngredient,
  timer,
  setTimer,
  timerActive,
  toggleTimer,
  resetTimer,
  setTimerMinutes,
}) => {
  const [showTip, setShowTip] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(recipe?.instructions?.length || 0).fill(false)
  );

  // Mark step as completed
  const markStepCompleted = (index: number) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);
  };

  // Calculate time estimates based on step content
  const getTimeEstimate = (step: string): number => {
    if (step.toLowerCase().includes("minutes")) {
      const match = step.match(/(\d+)\s*minutes/i);
      if (match && match[1]) return parseInt(match[1]);
    }
    if (step.toLowerCase().includes("hour")) {
      const match = step.match(/(\d+)\s*hour/i);
      if (match && match[1]) return parseInt(match[1]) * 60;
    }
    return 5; // Default 5 minutes
  };

  // Set timer for current step
  const setTimerForCurrentStep = () => {
    if (recipe?.instructions?.[currentStep]) {
      const minutes = getTimeEstimate(recipe.instructions[currentStep]);
      setTimerMinutes(minutes);
      toggleTimer();
    }
  };

  // Get cooking tip for current step
  const getCookingTip = (step: string): string => {
    if (step.toLowerCase().includes("boil")) {
      return "Add a pinch of salt to water to increase the boiling temperature and cook food faster.";
    }
    if (step.toLowerCase().includes("fry") || step.toLowerCase().includes("sauté")) {
      return "Heat the pan before adding oil to prevent food from sticking.";
    }
    if (step.toLowerCase().includes("meat") || step.toLowerCase().includes("chicken")) {
      return "Let meat rest for a few minutes after cooking to retain juices.";
    }
    if (step.toLowerCase().includes("vegetable")) {
      return "Don't overcook vegetables to preserve nutrients and texture.";
    }
    return "Remember to taste and adjust seasoning as you cook.";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <ChefHat className="mr-3 text-orange-500" size={28} />
          Cooking Mode: {recipe?.title || "Recipe"}
        </h1>
        <button
          onClick={toggleCookingMode}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          Exit Cooking Mode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Ingredients & Timer */}
        <div className="md:col-span-1 space-y-6">
          {/* Ingredients */}
          <div className="bg-gray-50 p-5 rounded-xl">
            <h3 className="font-bold text-xl mb-4 text-gray-800">Ingredients</h3>
            <ul className="space-y-2">
              {recipe?.ingredients?.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center p-3 hover:bg-white rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedIngredients[index] || false}
                    onChange={() => handleIngredientClick(index)}
                    className="w-5 h-5 rounded-full mr-3 accent-orange-500"
                  />
                  <span
                    className={
                      checkedIngredients[index]
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }
                  >
                    {typeof item === "object" && item !== null && "name" in item
                      ? getConvertedIngredient(item)
                      : "Invalid data"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Timer Component */}
          <Timer
            timer={timer}
            setTimer={setTimer}
            timerActive={timerActive}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
            setTimerMinutes={setTimerMinutes}
          />

          {/* Progress Overview */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Progress</h3>
            <div className="space-y-3">
              {recipe?.instructions?.map((step, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    currentStep === idx ? "bg-orange-100" : completedSteps[idx] ? "bg-green-50" : "bg-gray-50"
                  }`}
                  onClick={() => currentStep !== idx && setCompletedSteps(prev => {
                    const newState = [...prev];
                    // Mark all previous steps as completed
                    for (let i = 0; i < idx; i++) {
                      newState[i] = true;
                    }
                    return newState;
                  })}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                    completedSteps[idx] 
                      ? "bg-green-500 text-white" 
                      : currentStep === idx 
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {completedSteps[idx] ? (
                      <Check size={14} />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className={`text-sm truncate ${
                    completedSteps[idx] 
                      ? "text-gray-400 line-through" 
                      : currentStep === idx 
                      ? "text-orange-700 font-medium"
                      : "text-gray-600"
                  }`}>
                    {step.length > 40 ? `${step.substring(0, 40)}...` : step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Current Step */}
        <div className="md:col-span-2">
          {/* Step Navigation */}
          <div className="mb-5 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              } transition-colors`}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous Step
            </button>
            <span className="font-medium text-gray-600">
              Step {currentStep + 1} of {recipe?.instructions?.length || 0}
            </span>
            <button
              onClick={() => {
                if (currentStep < (recipe?.instructions?.length || 0) - 1) {
                  // Mark current step as completed when moving to next
                  const newCompletedSteps = [...completedSteps];
                  newCompletedSteps[currentStep] = true;
                  setCompletedSteps(newCompletedSteps);
                  nextStep();
                }
              }}
              disabled={currentStep === (recipe?.instructions?.length || 0) - 1}
              className={`px-4 py-2 rounded-lg flex items-center ${
                currentStep === (recipe?.instructions?.length || 0) - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              } transition-colors`}
            >
              Next Step
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          {/* Current Step */}
          <div className="bg-orange-50 p-8 rounded-xl">
            <div className="mb-5 flex items-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                {currentStep + 1}
              </div>
              <div className="ml-4">
                <span className="text-sm text-orange-700 font-medium px-3 py-1 bg-orange-100 rounded-full">
                  {currentStep === 0
                    ? "Start"
                    : currentStep === (recipe?.instructions?.length || 0) - 1
                    ? "Final Step"
                    : `Step ${currentStep + 1}`}
                </span>
                <button
                  onClick={() => {
                    markStepCompleted(currentStep);
                  }}
                  className={`ml-2 text-sm px-3 py-1 rounded-full ${
                    completedSteps[currentStep]
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {completedSteps[currentStep] ? (
                    <>
                      <Check size={14} className="inline mr-1" />
                      Completed
                    </>
                  ) : (
                    "Mark Complete"
                  )}
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              {recipe?.instructions?.[currentStep] || "No instructions available"}
            </h2>

            {/* Cooking tip */}
            {showTip && recipe?.instructions?.[currentStep] && (
              <div className="mt-4 mb-5 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg relative">
                <button 
                  onClick={() => setShowTip(false)}
                  className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
                >
                  <X size={16} />
                </button>
                <h4 className="font-medium text-blue-700 mb-1">Cooking Tip</h4>
                <p className="text-blue-600">{getCookingTip(recipe.instructions[currentStep])}</p>
              </div>
            )}

            {/* Timer control for current step */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={setTimerForCurrentStep}
                className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg flex items-center transition-colors"
              >
                <Clock size={18} className="mr-2" />
                Start Timer for This Step
              </button>
              {!showTip && (
                <button
                  onClick={() => setShowTip(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg flex items-center transition-colors"
                >
                  <Info size={18} className="mr-2" />
                  Show Cooking Tip
                </button>
              )}
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="mt-6 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full"
              style={{
                width: `${
                  ((currentStep + 1) / (recipe?.instructions?.length || 1)) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="mt-2 text-right text-sm text-gray-500">
            Progress {Math.round(((currentStep + 1) / (recipe?.instructions?.length || 1)) * 100)}%
          </div>

          {/* Completed all steps message */}
          {currentStep === (recipe?.instructions?.length || 0) - 1 && completedSteps[currentStep] && (
            <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-xl">
              <h3 className="font-bold text-green-800 text-lg mb-2 flex items-center">
                <Check size={20} className="mr-2" />
                Recipe Completed!
              </h3>
              <p className="text-green-700">
                Congratulations! You've completed all the steps in this recipe. Enjoy your meal!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookingModeView;