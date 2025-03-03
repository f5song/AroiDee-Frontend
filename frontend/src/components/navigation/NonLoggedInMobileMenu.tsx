import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavItem from './NavItem';
import { RECIPE_MENU_ITEMS, MEAL_PLANNING_ITEMS } from './constants';

interface NonLoggedInMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NonLoggedInMobileMenu: React.FC<NonLoggedInMobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    {
      title: 'Recipes',
      hasDropdown: true,
      dropdownItems: RECIPE_MENU_ITEMS,
      isActive: location.pathname.startsWith('/recipes'),
    },
    {
      title: 'Meal Planning',
      hasDropdown: true,
      dropdownItems: MEAL_PLANNING_ITEMS,
      isActive: location.pathname.startsWith('/meal-planning'),
    },
    {
      title: 'Categories',
      path: '/categories',
      isActive: location.pathname.startsWith('/categories'),
    },
    {
      title: 'Community',
      path: '/community',
      isActive: location.pathname.startsWith('/community'),
    },
  ];

  // Add the animation styles using a regular style tag
  useEffect(() => {
    // Create a style element
    const styleEl = document.createElement('style');
    // Define the keyframe animation
    styleEl.innerHTML = `
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    // Append to document head
    document.head.appendChild(styleEl);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`fixed top-16 left-0 right-0 w-full max-w-sm mx-auto bg-white shadow-xl rounded-lg overflow-y-auto max-h-[80vh] transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="p-6 pb-10 space-y-5">
          {navItems.map((item, index) => (
            <div 
              key={index} 
              style={{ 
                animation: isOpen ? 'fadeSlideIn 0.3s ease forwards' : 'none',
                animationDelay: `${index * 80}ms`,
                opacity: 0
              }}
            >
              <NavItem {...item} isMobile={true} />
            </div>
          ))}
          
          <div 
            className="mt-5 pt-5 border-t border-gray-200 space-y-3"
            style={{ 
              animation: isOpen ? 'fadeSlideIn 0.3s ease forwards' : 'none',
              animationDelay: `${navItems.length * 80 + 100}ms`,
              opacity: 0
            }}
          >
            <Link 
              to="/login" 
              className="block w-full text-center px-4 py-3 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors"
              onClick={onClose}
            >
              เข้าสู่ระบบ
            </Link>
            
            <Link 
              to="/signup" 
              className="block w-full text-center px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors shadow-sm"
              onClick={onClose}
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NonLoggedInMobileMenu;