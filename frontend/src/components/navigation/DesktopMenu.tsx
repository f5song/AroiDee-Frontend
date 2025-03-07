import React from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from '@/components/navigation/NavItem';
import { RECIPE_MENU_ITEMS, MEAL_PLANNING_ITEMS } from '@/components/navigation/constants';

const DesktopMenu: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavItem
        title="Recipes"
        hasDropdown
        dropdownItems={RECIPE_MENU_ITEMS}
        isActive={location.pathname.startsWith('/recipes')}
      />
      <NavItem
        title="Meal Planning"
        hasDropdown
        dropdownItems={MEAL_PLANNING_ITEMS}
        isActive={location.pathname.startsWith('/meal-planning')}
      />
      
    </div>
  );
};

export default DesktopMenu;