import React from "react";
import { Clock, Star } from "lucide-react";
import { RelatedRecipesProps } from "../../types/recipe";

const RelatedRecipes: React.FC<RelatedRecipesProps> = ({ recipes }) => {
  console.log("📌 Related Recipes:", recipes); // ✅ ตรวจสอบข้อมูลใน Console

  if (!recipes || recipes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">คุณอาจจะชอบ</h2>
        <p className="text-gray-500">ไม่มีสูตรอาหารที่เกี่ยวข้อง</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">คุณอาจจะชอบ</h2>
      <div className="space-y-4">
        {recipes.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 group cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img
              src={item.image_url || "/default-recipe.jpg"}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-lg group-hover:shadow-md transition-all"
            />
            <div>
              <h3 className="font-medium group-hover:text-orange-500 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>{item.cook_time ? `${item.cook_time} นาที` : "ไม่ระบุเวลา"}</span>
                <span className="mx-2">•</span>
                <Star size={14} className="mr-1 text-yellow-400" fill="currentColor" />
                <span>{item.rating ? item.rating.toFixed(1) : "N/A"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedRecipes;
