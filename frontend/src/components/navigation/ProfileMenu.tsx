import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import useOutsideClick from "@/lib/hooks/useOutsideClick";
import {
  PROFILE_MENU_ITEMS,
  DropdownItem,
} from "@/components/navigation/constants";

interface ProfileMenuProps {
  isMobile?: boolean;
}

// Add the animation keyframes using useEffect
const useProfileAnimationStyles = () => {
  useEffect(() => {
    // Create a style element for our animations
    const styleEl = document.createElement("style");

    // Define the keyframe animations
    styleEl.innerHTML = ` 
      @keyframes profileDropIn {
        from { opacity: 0; transform: translateY(-10px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      
      @keyframes profileItemSlideIn {
        from { opacity: 0; transform: translateX(-8px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .profile-dropdown { animation: profileDropIn 0.25s ease-out forwards; transform-origin: top right; }
      .profile-dropdown-item { opacity: 0; animation: profileItemSlideIn 0.3s ease forwards; }
    `;

    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
};

// Custom dropdown specifically for the profile menu
const ProfileDropdown: React.FC<{ items: DropdownItem[] }> = ({ items }) => {
  useProfileAnimationStyles();

  return (
    <div
      className="absolute top-full right-0 mt-1 bg-white shadow-xl rounded-lg p-2 min-w-[220px] z-20 
      border border-gray-100 profile-dropdown"
    >
      {items.map((item: DropdownItem, index: number) =>
        item.path ? (
          <Link
            key={index}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-orange-500 
              hover:bg-orange-50 transition-colors duration-200 profile-dropdown-item"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {item.icon && <span className="text-orange-500">{item.icon}</span>}
            <span>{item.name}</span>
          </Link>
        ) : (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-orange-500 
              hover:bg-orange-50 transition-colors duration-200 profile-dropdown-item"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {item.icon && <span className="text-orange-500">{item.icon}</span>}
            <span>{item.name}</span>
          </button>
        )
      )}
    </div>
  );
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useOutsideClick(() => setIsOpen(false));
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (timer.current) clearTimeout(timer.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    timer.current = setTimeout(() => setIsOpen(false), 150);
  };

  const menuItems = PROFILE_MENU_ITEMS(); // ✅ Call function to get the menu items

  // Fetch profile data including image URL
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          "https://aroi-dee-backend.vercel.app/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // ส่ง token
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Log ดูข้อมูลทั้งหมดที่ได้จาก API
          if (data && data.user && data.user.image_url) {
            setImageUrl(data.user.image_url); // Update image URL from the API
          } else {
            console.log("Image URL not found in the response");
          }
        } else {
          console.error("Error fetching profile data, response not OK");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  // For mobile, we'll still use the existing pattern seen in MobileMenu
  if (isMobile) {
    useProfileAnimationStyles();

    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 text-lg rounded-md transition-all duration-200"
        >
          Profile
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="overflow-hidden transition-all duration-300 my-2">
            <div className="border-l-4 border-orange-300 ml-6 pl-4 py-2 space-y-2 bg-orange-50/30 rounded-r-md shadow-inner">
              {menuItems.map((item, index) =>
                item.path ? (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
                    style={{
                      animationDelay: `${75 + index * 50}ms`,
                      opacity: 0,
                      transform: "translateX(-10px)",
                    }}
                  >
                    {item.icon && (
                      <span className="text-orange-500 flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-base">{item.name}</span>
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors duration-200"
                    style={{
                      animationDelay: `${75 + index * 50}ms`,
                      opacity: 0,
                      transform: "translateX(-10px)",
                    }}
                  >
                    {item.icon && (
                      <span className="text-orange-500 flex-shrink-0">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-base">{item.name}</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-orange-50 transition-colors duration-200"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={imageUrl || "/api/placeholder/40/40"} // Fallback to placeholder if no image URL
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && <ProfileDropdown items={menuItems} />}
    </div>
  );
};

export default ProfileMenu;
