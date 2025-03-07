import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem } from '@/components/navigation/constants';

interface DropdownMenuProps {
  items: DropdownItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => (
  <div className="absolute top-full left-0 mt-1 bg-white shadow-xl rounded-lg p-2 min-w-[220px] z-20 animate-in fade-in slide-in-from-top-2 duration-200 border border-gray-100">
    {items.map((item, index) => (
      <Link
        key={index}
        to={item.path}
        className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
      >
        {item.icon && <span className="text-orange-500">{item.icon}</span>}
        <span>{item.name}</span>
      </Link>
    ))}
  </div>
);

export default DropdownMenu;