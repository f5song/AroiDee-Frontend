import React from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';
import { RECIPE_MENU_ITEMS, MEAL_PLANNING_ITEMS } from './constants';

const DesktopMenu: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      <NavItem
        title="Recipes"
        hasDropdown
        dropdownItems={RECIPE_MENU_ITEMS.map(({ name, path }) => ({ name, path }))}
        isActive={location.pathname.startsWith('/recipes')}
      />
      <NavItem
        title="Meal Planning"
        hasDropdown
        dropdownItems={MEAL_PLANNING_ITEMS.map(({ name, path }) => ({ name, path }))}
        isActive={location.pathname.startsWith('/meal-planning')}
      />
      <NavItem
        title="Categories"
        path="/categories"
        isActive={location.pathname.startsWith('/categories')}
      />
      <NavItem
        title="Community"
        path="/community"
        isActive={location.pathname.startsWith('/community')}
      />
    </div>
  );
};

export default DesktopMenu;