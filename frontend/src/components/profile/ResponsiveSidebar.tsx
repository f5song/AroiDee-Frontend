// UPDATED ResponsiveSidebar.tsx - To prevent double sidebar
import React from "react";
import DesktopSidebar from "./ProfileSideBar";
import MobileSidebar from "./MobileProfileSidebar";

interface ResponsiveSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <>
      {/* Desktop Sidebar - Only visible on md screens and up */}
      <div className="hidden md:block">
        <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Mobile Sidebar - Only visible on smaller than md screens */}
      <div className="md:hidden">
        <MobileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
};

export default ResponsiveSidebar;