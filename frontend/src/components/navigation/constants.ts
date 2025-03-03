import React from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Calendar, 
  Utensils, 
  BookOpen, 
  ChefHat, 
  Clock, 
  Bookmark
} from 'lucide-react';

export type DropdownItem = {
  name: string;
  path: string;
  icon?: React.ReactNode;
};

export const RECIPE_MENU_ITEMS: DropdownItem[] = [
  { 
    name: "Explore Recipes", 
    path: "/recipes/explore", 
    icon: React.createElement(Utensils, { className: "w-5 h-5" }) 
  },
  { 
    name: "My Recipes", 
    path: "/recipes/my-recipes", 
    icon: React.createElement(ChefHat, { className: "w-5 h-5" }) 
  },
  { 
    name: "Saved Recipes", 
    path: "/recipes/saved", 
    icon: React.createElement(Heart, { className: "w-5 h-5" }) 
  },
  { 
    name: "Recent Recipes", 
    path: "/recipes/recent", 
    icon: React.createElement(Clock, { className: "w-5 h-5" }) 
  }
];

export const MEAL_PLANNING_ITEMS: DropdownItem[] = [
  { 
    name: "Weekly Planner", 
    path: "/meal-planning/planner", 
    icon: React.createElement(Calendar, { className: "w-5 h-5" }) 
  },
  { 
    name: "Nutrition Tracker", 
    path: "/meal-planning/tracker", 
    icon: React.createElement(BookOpen, { className: "w-5 h-5" }) 
  },
  { 
    name: "Saved Plans", 
    path: "/meal-planning/saved", 
    icon: React.createElement(Bookmark, { className: "w-5 h-5" }) 
  }
];

export const PROFILE_MENU_ITEMS: DropdownItem[] = [
  { 
    name: "My Profile", 
    path: "/profile", 
    icon: React.createElement(User, { className: "w-5 h-5" }) 
  },
  { 
    name: "Account Settings", 
    path: "/settings", 
    icon: React.createElement(Settings, { className: "w-5 h-5" }) 
  },
  { 
    name: "Logout", 
    path: "/logout", 
    icon: React.createElement(LogOut, { className: "w-5 h-5" }) 
  }
];