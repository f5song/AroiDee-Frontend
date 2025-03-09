import React from 'react';
import { useAuth } from '@/components/auth/AuthContext'; // ✅ ดึง useAuth()
import { 
  User, 
  LogOut, 
  Calendar, 
  Utensils, 
  ChefHat
} from 'lucide-react';

export type DropdownItem = {
  name: string;
  path?: string; // เปลี่ยนเป็น optional
  icon?: React.ReactNode;
  onClick?: () => void; // ✅ เพิ่ม event handler
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
  }
];

export const MEAL_PLANNING_ITEMS: DropdownItem[] = [
  { 
    name: "Weekly Planner", 
    path: "/meal-planning/planner", 
    icon: React.createElement(Calendar, { className: "w-5 h-5" }) 
  }
];

// ✅ แก้ไข PROFILE_MENU_ITEMS ให้ logout ใช้ onClick
export const PROFILE_MENU_ITEMS = () => {
  const { logout } = useAuth(); // ✅ ใช้ useAuth() เพื่อดึง logout()

  return [
    { 
      name: "My Profile", 
      path: "/profile", 
      icon: React.createElement(User, { className: "w-5 h-5" }) 
    },
    // { 
    //   name: "Account Settings", 
    //   path: "/settings", 
    //   icon: React.createElement(Settings, { className: "w-5 h-5" }) 
    // },
    { 
      name: "Logout", 
      onClick: logout, // ✅ เรียก logout() ตรงนี้
      icon: React.createElement(LogOut, { className: "w-5 h-5" }) 
    }
  ];
};

