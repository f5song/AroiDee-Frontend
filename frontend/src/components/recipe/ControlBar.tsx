import React from "react";
import { Download, Printer, ChefHat } from "lucide-react";
import { ControlBarProps } from "../../types/recipe";

const ControlBar: React.FC<ControlBarProps> = ({ 

  toggleCookingMode
}) => (
  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 px-6 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 justify-between items-center">

    <div className="flex gap-3 flex-wrap">
      <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors">
        <Download size={16} className="mr-2" />
        ดาวน์โหลด
      </button>
      <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors">
        <Printer size={16} className="mr-2" />
        พิมพ์
      </button>
      <button 
        onClick={toggleCookingMode}
        className="flex items-center text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
      >
        <ChefHat size={16} className="mr-2" />
        เริ่มทำอาหาร
      </button>
    </div>
  </div>
);

export default ControlBar;