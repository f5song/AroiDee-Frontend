import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import useOutsideClick from '../hooks/useOutsideClick';
import DropdownMenu from './DropdownMenu';
import { DropdownItem } from './constants';

interface NavItemProps {
  title: string;
  path?: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
  isActive?: boolean;
  children?: React.ReactNode;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  title,
  path,
  hasDropdown = false,
  dropdownItems = [],
  isActive = false,
  children,
  isMobile = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useOutsideClick(() => setIsOpen(false));
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Mobile specific - close dropdown when route changes
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [path, isMobile]);

  const handleMouseEnter = () => {
    if (isMobile) return; // Disable hover behavior on mobile
    if (timer.current) clearTimeout(timer.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover behavior on mobile
    timer.current = setTimeout(() => setIsOpen(false), 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown && isMobile) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  const activeClass = isActive
    ? 'text-orange-500 bg-orange-50 font-medium'
    : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50';

  return (
    <div
      ref={dropdownRef}
      className={`relative ${isMobile ? 'w-full' : 'group'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {path && (!hasDropdown || !isMobile) ? (
        <Link
          to={path}
          className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${activeClass} ${isMobile ? 'w-full text-lg' : ''}`}
          onClick={handleClick}
        >
          {title}
          {hasDropdown && (
            <ChevronDown
              className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${activeClass} ${isMobile ? 'w-full justify-between text-lg' : ''}`}
        >
          {children || title}
          {hasDropdown && !children && (
            <ChevronDown
              className={`ml-1 w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>
      )}

      {hasDropdown && isOpen && dropdownItems.length > 0 && (
        isMobile ? (
          <div className="overflow-hidden transition-all duration-300 my-2">
            <div className="border-l-4 border-orange-300 ml-6 pl-4 py-2 space-y-2 bg-orange-50/30 rounded-r-md shadow-inner">
              {dropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
                  style={{ 
                    animation: 'slideIn 0.3s ease forwards',
                    animationDelay: `${75 + index * 50}ms`,
                    opacity: 0,
                    transform: 'translateX(-10px)'
                  }}
                >
                  {item.icon && (
                    <span className="text-orange-500 flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span className="text-base">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <DropdownMenu items={dropdownItems} />
        )
      )}

      {/* Add keyframe animation for the link items */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NavItem;