import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // ✅ ใช้ Context ที่ถูกต้อง
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import NavItem from "./NavItem";

interface ProfileMenuProps {
  isMobile?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const auth = useAuth(); // ✅ ตรวจสอบว่ามีค่า auth จริง ๆ

  if (!auth) {
    console.error("Auth Context is not available");
    return null; // ❌ ถ้า `auth` ไม่มีค่าก็ไม่ render อะไรเลย (ป้องกัน React Crash)
  }

  const { logout } = auth;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // ✅ นำผู้ใช้ไปหน้า Login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const PROFILE_MENU_ITEMS = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <User className="w-5 h-5" />,
    },
    {
      name: "Account Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Logout",
      path: "",
      onClick: handleLogout,
      icon: <LogOut className="w-5 h-5" />,
    }, // ✅ ใช้ path: "" แทน undefined
  ];

  return (
    <NavItem
      title={isMobile ? "Profile" : ""}
      hasDropdown
      dropdownItems={PROFILE_MENU_ITEMS}
      isMobile={isMobile}
    >
      {!isMobile && (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      )}
    </NavItem>
  );
};

export default ProfileMenu;
