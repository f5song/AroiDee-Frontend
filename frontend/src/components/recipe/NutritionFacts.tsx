import React from "react";
import { NutritionFactsProps } from "../../types/recipe";

const NutritionFacts: React.FC<NutritionFactsProps> = ({ 
  nutrition, 
  showNutritionDetails, 
  setShowNutritionDetails 
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-800">คุณค่าทางโภชนาการ</h2>
      <button
        onClick={() => setShowNutritionDetails(!showNutritionDetails)}
        className="text-orange-500 hover:text-orange-600 text-sm underline"
      >
        {showNutritionDetails ? "ซ่อนรายละเอียด" : "แสดงรายละเอียด"}
      </button>
    </div>
    
    <div className="space-y-4">
      {Object.entries(nutrition).map(([key, value]) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                key === 'calories' ? 'bg-orange-500' :
                key === 'protein' ? 'bg-blue-500' :
                key === 'fat' ? 'bg-yellow-500' :
                key === 'carbs' ? 'bg-green-500' : 'bg-red-400'
              }`}></div>
              <span className="capitalize text-gray-700">{key}</span>
            </div>
            <span className="font-medium">{value}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                key === 'calories' ? 'bg-orange-500' :
                key === 'protein' ? 'bg-blue-500' :
                key === 'fat' ? 'bg-yellow-500' :
                key === 'carbs' ? 'bg-green-500' : 'bg-red-400'
              }`}
              style={{ 
                width: key === 'calories' ? '75%' :
                      key === 'protein' ? '25%' :
                      key === 'fat' ? '65%' :
                      key === 'carbs' ? '50%' : '80%'
              }}
            ></div>
          </div>
        </div>
      ))}

      {showNutritionDetails && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <h3 className="font-medium mb-3 text-gray-800">รายละเอียดเพิ่มเติม</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">คอเลสเตอรอล</span>
              <span>45mg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">โซเดียม</span>
              <span>250mg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">แคลเซียม</span>
              <span>15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เหล็ก</span>
              <span>4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วิตามิน C</span>
              <span>10%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">วิตามิน D</span>
              <span>8%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default NutritionFacts;