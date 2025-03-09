import React from "react";
import { AlertCircle } from "lucide-react";
import { AllergyInfoProps } from "../../types/recipe";

const AllergyInfo: React.FC<AllergyInfoProps> = ({ showAllergies, setShowAllergies }) => {
  if (!showAllergies) return null;
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle size={20} className="text-yellow-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-800">Allergy Information</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This recipe contains dairy products, may contain eggs, and gluten. If you have food allergies, please consider using substitute ingredients.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAllergies(false)}
          className="text-yellow-500 hover:text-yellow-700 p-2"
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AllergyInfo;