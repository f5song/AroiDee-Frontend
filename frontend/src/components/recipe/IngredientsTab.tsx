import React from "react";
import { IngredientsTabProps } from "../../types/recipe";

const IngredientsTab: React.FC<IngredientsTabProps> = ({
  ingredients,
  checkedIngredients,
  handleIngredientClick,
  getConvertedIngredient,
}) => (
  <div>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-gray-800">ส่วนผสม</h2>
    </div>
    <ul className="space-y-3 mb-6">
      {ingredients.map((item, index) => {
        console.log("Ingredient:", item); // ✅ Debug
        return (
          <li
            key={index}
            className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={checkedIngredients[index]}
              onChange={() => handleIngredientClick(index)}
              className="w-5 h-5 rounded-full cursor-pointer accent-orange-500 mr-4"
            />
            <span
              className={
                checkedIngredients[index]
                  ? "line-through text-gray-400"
                  : "text-gray-700 font-medium"
              }
            >
              {getConvertedIngredient(item)}
            </span>
            
          </li>
          
        );
        
      })}
    </ul>
  </div>
);

export default IngredientsTab;
