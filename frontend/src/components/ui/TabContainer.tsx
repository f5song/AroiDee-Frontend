import React from "react";
import { MessageCircle } from "lucide-react";
import { TabContainerProps } from "../../types/recipe";

const TabContainer: React.FC<TabContainerProps> = ({ 
  activeTab, 
  setActiveTab, 
  commentCount,
  children 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("ingredients")}
          className={`flex-1 py-4 px-4 font-medium text-center transition-all ${
            activeTab === "ingredients"
              ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          ส่วนผสม
        </button>
        <button
          onClick={() => setActiveTab("instructions")}
          className={`flex-1 py-4 px-4 font-medium text-center transition-all ${
            activeTab === "instructions"
              ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          วิธีทำ
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex-1 py-4 px-4 font-medium text-center transition-all ${
            activeTab === "comments"
              ? "text-orange-500 border-b-2 border-orange-500 bg-orange-50"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          <MessageCircle size={16} className="inline mr-1" />
          รีวิว ({commentCount})
        </button>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default TabContainer;