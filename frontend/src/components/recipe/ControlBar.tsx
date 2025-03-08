import React from "react";
import { Filter, AlertCircle, Download, Printer, ChefHat } from "lucide-react";
import { ControlBarProps } from "../../types/recipe";

const ControlBar: React.FC<ControlBarProps> = ({ 
  toggleUnit, 
  selectedUnit, 
  setShowAllergies, 
  showAllergies,
  toggleCookingMode
}) => (
  <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 px-6 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 justify-between items-center">
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={toggleUnit}
        className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors"
      >
        <Filter size={16} className="mr-2" />
        {selectedUnit === "metric" ? "เปลี่ยนเป็นอิมพีเรียล" : "เปลี่ยนเป็นเมตริก"}
      </button>
      <button
        onClick={() => setShowAllergies(!showAllergies)}
        className="flex items-center text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full transition-colors"
      >
        <AlertCircle size={16} className="mr-2" />
        ข้อมูลแพ้อาหาร
      </button>
    </div>
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