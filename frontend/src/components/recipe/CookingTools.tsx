import React from "react";

const CookingTools: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">อุปกรณ์ที่ต้องใช้</h2>
    <ul className="space-y-3">
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>พิมพ์เค้กกลม ขนาด 8 นิ้ว</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>เครื่องผสมอาหาร</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>ชามผสม</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>ไม้พาย</span>
      </li>
      <li className="flex items-center p-2 bg-gray-50 rounded-lg">
        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
        <span>ตู้เย็น</span>
      </li>
    </ul>
  </div>
);

export default CookingTools;