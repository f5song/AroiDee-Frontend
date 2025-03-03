import React from "react";
import { motion } from "framer-motion";
import { Bell, X } from "lucide-react";

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
  onDismiss: (id: string) => void;
}

const getTypeStyles = (type: "success" | "warning" | "info") => {
  switch (type) {
    case "success":
      return "bg-green-50 border-green-300";
    case "warning":
      return "bg-yellow-50 border-yellow-300";
    case "info":
    default:
      return "bg-blue-50 border-blue-300";
  }
};

const Notification: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  time,
  type,
  onDismiss,
}) => {
  return (
    <motion.div
      className={`relative p-4 rounded-lg border ${getTypeStyles(
        type
      )} shadow-sm`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => onDismiss(id)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{message}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </motion.div>
  );
};

interface NotificationsProps {
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    type: "success" | "warning" | "info";
  }[];
  onDismiss: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default Notifications;