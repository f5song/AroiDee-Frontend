import React, { useState } from "react";
import Notifications from "./Notifications";
import SettingsContent from "./SettingsContent";
import { Profile } from "./ProfileTypes";

// Common component for empty state tab content
interface TabContentProps {
  title: string;
  message: string;
}

const TabContent: React.FC<TabContentProps> = ({ title, message }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p>{message}</p>
  </div>
);

// Export individual tab content components
export const SavedRecipesContent: React.FC = () => (
  <TabContent 
    title="Your Saved Recipes" 
    message="You haven't saved any recipes yet." 
  />
);

export const ShoppingListContent: React.FC = () => (
  <TabContent 
    title="Your Shopping List" 
    message="Your shopping list is empty." 
  />
);

export const NutritionTrackerContent: React.FC = () => (
  <TabContent 
    title="Nutrition Tracker" 
    message="Start tracking your nutrition goals here." 
  />
);

export const MealPlansContent: React.FC = () => (
  <TabContent 
    title="Meal Plans" 
    message="Create and view your meal plans here." 
  />
);

export const MyRecipesContent: React.FC = () => (
  <TabContent 
    title="My Recipes" 
    message="You haven't created any recipes yet." 
  />
);

// Updated Notifications content with active notifications
export const NotificationsContent: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      time: "2 hours ago",
      type: "success" as const,
    },
    {
      id: "2",
      title: "New Recipe Added",
      message: "A new recipe matching your preferences has been added.",
      time: "Yesterday",
      type: "info" as const,
    },
    {
      id: "3",
      title: "Subscription Expiring",
      message: "Your premium subscription will expire in 3 days.",
      time: "3 days ago",
      type: "warning" as const,
    },
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  if (notifications.length === 0) {
    return (
      <TabContent 
        title="Notifications" 
        message="You have no new notifications." 
      />
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <Notifications 
        notifications={notifications} 
        onDismiss={dismissNotification} 
      />
    </div>
  );
};

// เปลี่ยนชื่อ component เพื่อไม่ให้ซ้ำกับการนำเข้า
interface SettingsProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  isEditable: boolean;
  setIsEditable: (isEditable: boolean) => void;
}

// เปลี่ยนชื่อจาก SettingsContent เป็น SettingsWrapper เพื่อไม่ให้ซ้ำกับการ import
export const SettingsWrapper: React.FC<SettingsProps> = ({ 
  profile, 
  setProfile, 
  isEditable, 
  setIsEditable 
}) => (
  <SettingsContent 
    profile={profile} 
    setProfile={setProfile} 
    isEditable={isEditable} 
    setIsEditable={setIsEditable} 
  />
);