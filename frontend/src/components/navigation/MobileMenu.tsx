import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { X } from 'lucide-react';
import NavItem from '@/components/navigation/NavItem';
import ProfileMenu from '@/components/navigation/ProfileMenu';
import { RECIPE_MENU_ITEMS, MEAL_PLANNING_ITEMS } from '@/components/navigation/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  isAuthenticated = false 
}) => {
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
    }

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
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
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
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white shadow-xl overflow-y-auto transition-all duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '-5px 0 25px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 pb-10 space-y-5 mt-12">
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
            className="mt-5 pt-5 border-t border-gray-200"
            style={{ 
              animation: isOpen ? 'fadeSlideIn 0.3s ease forwards' : 'none',
              animationDelay: `${navItems.length * 80 + 100}ms`,
              opacity: 0
            }}
          >
            {isAuthenticated ? (
              <ProfileMenu isMobile={true} />
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-4 py-3 text-orange-500 border border-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                  onClick={onClose}
                >
                  Login
                </Link>
                
                <Link 
                  to="/signup" 
                  className="block w-full text-center px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors shadow-sm"
                  onClick={onClose}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;