import React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Heart, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Calendar, 
  PenTool,
  Bell,
  Flame
} from "lucide-react";

interface TabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ icon, label, isActive, onClick }) => (
  <motion.div
    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
      isActive 
        ? "bg-primary text-white shadow-md" 
        : "hover:bg-gray-100 text-gray-700"
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </motion.div>
);

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  // Define tabs - ensure these match exactly with the ones in MobileProfileSidebar
  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={20} /> },
    { id: "saved", label: "Saved Recipes", icon: <Heart size={20} /> },
    // { id: "shopping", label: "Shopping List", icon: <ShoppingCart size={20} /> },
    { id: "nutrition", label: "Nutrition Tracker", icon: <BarChart2 size={20} /> },
    // { id: "meal-plans", label: "Meal Plans", icon: <Calendar size={20} /> },
    { id: "recipes", label: "My Recipes", icon: <PenTool size={20} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={20} /> },
    { id: "calorie-goals", label: "Calorie Goals", icon: <Flame size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <motion.div 
      className="w-full md:w-64 bg-white rounded-xl shadow-lg p-4 space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          icon={tab.icon}
          label={tab.label}
          isActive={activeTab === tab.id}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </motion.div>
  );
};

export default ProfileSidebar;