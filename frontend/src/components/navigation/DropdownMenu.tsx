import React from "react";
import { Link } from "react-router-dom";
import { DropdownItem } from "./constants";

interface DropdownMenuProps {
  items: DropdownItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => (
  <div className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-lg p-2 min-w-[220px] z-20">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {item.onClick ? (
          <button
            onClick={() => item.onClick?.()} // ✅ ใช้ onClick
            className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
          >
            {item.icon && <span className="text-orange-500">{item.icon}</span>}
            <span>{item.name}</span>
          </button>
        ) : (
          <Link
            to={item.path ?? "#"}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
          >
            {item.icon && <span className="text-orange-500">{item.icon}</span>}
            <span>{item.name}</span>
          </Link>
        )}
      </React.Fragment>
    ))}
  </div>
);

export default DropdownMenu;
