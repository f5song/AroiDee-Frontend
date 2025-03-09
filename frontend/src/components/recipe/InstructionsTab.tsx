import React from "react";
import { ChefHat, Camera, Clock } from "lucide-react";
import { InstructionsTabProps } from "../../types/recipe";

const InstructionsTab: React.FC<InstructionsTabProps> = ({ 
  instructions, 
  toggleCookingMode, 
  setTimerMinutes 
}) => (
  <div>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-gray-800">Instructions</h2>
      <button
        onClick={toggleCookingMode}
        className="text-sm bg-orange-500 text-white hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center transition-colors"
      >
        <ChefHat size={16} className="mr-2" />
        Start Cooking
      </button>
    </div>
    <ol className="space-y-8 relative before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-100">
      {instructions.map((step, index) => (
        <li key={index} className="pl-12 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
            {index + 1}
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <p className="text-gray-700">{step}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
);

export default InstructionsTab;