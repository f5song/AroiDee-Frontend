import React from "react";
import { ChefHat, ArrowLeft, ArrowRight, Clock, Camera } from "lucide-react";
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
  timerActive, 
  toggleTimer, 
  resetTimer, 
  setTimerMinutes 
}) => (
  <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
        <ChefHat className="mr-3 text-orange-500" size={28} />
        โหมดทำอาหาร: {recipe.title}
      </h1>
      <button
        onClick={toggleCookingMode}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
      >
        ออกจากโหมดทำอาหาร
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left: Ingredients & Timer */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-gray-50 p-5 rounded-xl">
          <h3 className="font-bold text-xl mb-4 text-gray-800">ส่วนผสม</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((item, index) => (
              <li
                key={index}
                className="flex items-center p-3 hover:bg-white rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedIngredients[index]}
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
                  {getConvertedIngredient(item)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Timer Component */}
        <Timer 
          timer={timer}
          timerActive={timerActive}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          setTimerMinutes={setTimerMinutes}
        />
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
            ขั้นตอนก่อนหน้า
          </button>
          <span className="font-medium text-gray-600">
            ขั้นตอนที่ {currentStep + 1} จาก {recipe.instructions.length}
          </span>
          <button
            onClick={nextStep}
            disabled={currentStep === recipe.instructions.length - 1}
            className={`px-4 py-2 rounded-lg flex items-center ${
              currentStep === recipe.instructions.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200"
            } transition-colors`}
          >
            ขั้นตอนถัดไป
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
                  ? "เริ่มต้น"
                  : currentStep === recipe.instructions.length - 1
                  ? "ขั้นตอนสุดท้าย"
                  : `ขั้นตอนที่ ${currentStep + 1}`}
              </span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-5">
            {recipe.instructions[currentStep]}
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            <button 
              onClick={() => setTimerMinutes(5)}
              className="px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg flex items-center transition-colors"
            >
              <Clock size={18} className="mr-2" />
              จับเวลาขั้นตอนนี้
            </button>
            <button className="px-4 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg flex items-center transition-colors">
              <Camera size={18} className="mr-2" />
              ดูภาพตัวอย่าง
            </button>
          </div>
        </div>
        
        {/* Step Progress Bar */}
        <div className="mt-6 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full rounded-full"
            style={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-right text-sm text-gray-500">
          ความคืบหน้า {Math.round(((currentStep + 1) / recipe.instructions.length) * 100)}%
        </div>
      </div>
    </div>
  </div>
);

export default CookingModeView;