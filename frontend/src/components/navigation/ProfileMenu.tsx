import React from 'react';
import { ChevronDown } from 'lucide-react';
import NavItem from './NavItem';
import { PROFILE_MENU_ITEMS } from './constants';

interface ProfileMenuProps {
  isMobile?: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isMobile = false }) => (
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

export default ProfileMenu;