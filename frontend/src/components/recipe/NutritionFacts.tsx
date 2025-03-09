import React from "react";
import { NutritionFactsProps } from "../../types/recipe";

const NutritionFacts: React.FC<NutritionFactsProps> = ({ nutrition }) => {
  // ✅ กำหนดค่าสูงสุดสำหรับแต่ละสารอาหาร (สามารถปรับค่าได้)
  const maxValues: { [key: string]: number } = {
    calories: 500,
    total_fat: 30,
    saturated_fat: 15,
    cholesterol: 100,
    sodium: 500,
    potassium: 1000,
    total_carbohydrate: 100,
    sugars: 50,
    protein: 50
  };

  // ✅ สีเฉพาะของแต่ละสารอาหาร
  const colorMap: { [key: string]: string } = {
    calories: "bg-orange-500",
    total_fat: "bg-red-500",
    saturated_fat: "bg-purple-500",
    cholesterol: "bg-orange-400",
    sodium: "bg-yellow-500",
    potassium: "bg-green-500",
    total_carbohydrate: "bg-blue-500",
    sugars: "bg-brown-500", // ถ้าไม่มี Tailwind ให้ใช้ bg-yellow-800 แทน
    protein: "bg-indigo-500"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">คุณค่าทางโภชนาการ</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(nutrition).map(([key, value]) => {
          const max = maxValues[key] || 100; // ✅ กำหนดค่า max ถ้าไม่มี
          const percentage = Math.min(100, (value / max) * 100); // ✅ ป้องกันค่าที่เกิน 100%
          const barColor = colorMap[key] || "bg-gray-400"; // ✅ สีเริ่มต้นคือเทาถ้าไม่เจอใน colorMap

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${barColor}`}></div>
                  <span className="capitalize text-gray-700">
                    {key.replace("_", " ")}
                  </span>
                </div>
                <span className="font-medium">{value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${barColor}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionFacts;
