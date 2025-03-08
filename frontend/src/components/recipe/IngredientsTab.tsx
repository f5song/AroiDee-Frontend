import React from "react";
import { Bell, Info } from "lucide-react";
import { IngredientsTabProps } from "../../types/recipe";

const IngredientsTab: React.FC<IngredientsTabProps> = ({ 
  ingredients, 
  checkedIngredients, 
  handleIngredientClick, 
  getConvertedIngredient
}) => (
  <div>
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-2xl font-bold text-gray-800">ส่วนผสม</h2>
      <button className="text-sm text-orange-500 hover:text-orange-600 flex items-center bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-colors">
        <Bell size={16} className="mr-2" />
        แจ้งเตือนส่วนผสมขาด
      </button>
    </div>
    <ul className="space-y-3 mb-6">
      {ingredients.map((item, index) => (
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
      ))}
    </ul>
    <div className="p-4 bg-orange-50 rounded-xl">
      <h3 className="flex items-center text-orange-700 font-medium mb-2">
        <Info size={18} className="mr-2" />
        เคล็ดลับ
      </h3>
      <p className="text-sm text-orange-700">
        สำหรับครีมชีสที่นุ่มกว่า ให้วางไว้ที่อุณหภูมิห้องประมาณ 30 นาทีก่อนใช้ เพื่อให้เนื้อเนียนและผสมได้ง่าย
      </p>
    </div>
  </div>
);

export default IngredientsTab;