import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import NavItem from "./NavItem";

interface ProfileMenuProps {
  isMobile?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ลบ Token จาก LocalStorage หรือ SessionStorage
      localStorage.removeItem("authToken");

      // ถ้ามี API Logout สามารถเรียกใช้งานได้ที่นี่
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include", // ใช้ถ้าคุณมี session-based auth
      });

      // นำผู้ใช้ไปหน้า Login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const PROFILE_MENU_ITEMS = [
    { name: "My Profile", path: "/profile", icon: <User className="w-5 h-5" /> },
    { name: "Account Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
    { name: "Logout", path: "#", icon: <LogOut className="w-5 h-5" />, onClick: handleLogout },
  ];

  return (
    <NavItem title={isMobile ? "Profile" : ""} hasDropdown dropdownItems={PROFILE_MENU_ITEMS} isMobile={isMobile}>
      {!isMobile && (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/api/placeholder/40/40" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      )}
    </NavItem>
  );
};

export default ProfileMenu;
