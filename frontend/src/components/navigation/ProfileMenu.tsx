import React from "react";
import { useNavigate } from "react-router-dom";
import {  User, Settings, LogOut } from "lucide-react";
import NavItem from "./NavItem";

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.removeItem("authToken"); // ลบ Token

      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include", // ถ้ามี session-based auth
      });

      navigate("/login"); // นำไปหน้า Login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const PROFILE_MENU_ITEMS = [
    { name: "My Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Account Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
    { name: "Logout", onClick: handleLogout, icon: <LogOut className="w-5 h-5" /> }, // ✅ ใช้ onClick แทน path
  ];

  return (
    <NavItem title="" hasDropdown dropdownItems={PROFILE_MENU_ITEMS}>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src="/api/placeholder/40/40" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
    </NavItem>
  );
};

export default ProfileMenu;
