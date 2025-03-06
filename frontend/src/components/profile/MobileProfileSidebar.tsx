import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Heart, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Calendar, 
  PenTool,
  Bell,
  Menu,
  X,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive, onClick }) => (
  <motion.div
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
      isActive 
        ? "bg-primary text-white" 
        : "hover:bg-gray-100 text-gray-700"
    }`}
    onClick={onClick}
    whileTap={{ scale: 0.97 }}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </motion.div>
);

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MobileProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Define the tabs - ensure these match exactly with the ones in ProfileSidebar
  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "saved", label: "Saved Recipes", icon: <Heart size={18} /> },
    // { id: "shopping", label: "Shopping List", icon: <ShoppingCart size={18} /> },
    { id: "nutrition", label: "Nutrition Tracker", icon: <BarChart2 size={18} /> },
    // { id: "meal-plans", label: "Meal Plans", icon: <Calendar size={18} /> },
    { id: "recipes", label: "My Recipes", icon: <PenTool size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "calorie-goals", label: "Calorie Goals", icon: <Flame size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // Mobile sidebar toggle button
  const MobileMenuButton = () => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md mb-4">
      <div className="flex items-center">
        <span className="font-bold text-gray-800 ml-2">
          {tabs.find(tab => tab.id === activeTab)?.label || "Menu"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
    </div>
  );

  // Mobile sidebar drawer
  const MobileSidebar = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar drawer */}
          <motion.div 
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-bold text-lg">Menu</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <X size={20} />
              </Button>
            </div>
            <div className="p-3 space-y-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  icon={tab.icon}
                  label={tab.label}
                  isActive={activeTab === tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <MobileMenuButton />
      <MobileSidebar />
    </>
  );
};

export default MobileProfileSidebar;