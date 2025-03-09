import React from "react";
import { IngredientsTabProps, Ingredient } from "../../types/recipe";

const IngredientsTab: React.FC<IngredientsTabProps> = ({
  ingredients = [],
  checkedIngredients,
  handleIngredientClick,
}) => {
  console.log("✅ Ingredients List:", ingredients); // ✅ Debug

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-gray-800">ส่วนผสม</h2>
      </div>
      <ul className="space-y-3 mb-6">
        {ingredients.length > 0 ? (
          ingredients.map((item: Ingredient, index: number) => {
            console.log("🛠 Ingredient Item:", item); // ✅ Debug
            return (
              <li
                key={item.id || index} // ✅ ใช้ `item.id` ถ้ามี ไม่งั้น fallback เป็น index
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
                  {item.name} - {item.quantity} {item.unit}
                </span>
              </li>
            );
          })
        ) : (
          <p className="text-gray-500">ไม่มีส่วนผสม</p>
        )}
      </ul>
    </div>
  );
};

export default IngredientsTab;
