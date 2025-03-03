import React from "react";
import { Heart, ShoppingCart, BarChart2 } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  bgColor: string;
  hoverColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, bgColor, hoverColor }) => (
  <div className={`p-4 ${bgColor} rounded-xl shadow hover:${hoverColor} transition`}>
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white bg-opacity-70 rounded-lg">{icon}</div>
        <h3 className="font-medium text-sm sm:text-base">{title}</h3>
      </div>
      <span className="font-bold text-lg">{value}</span>
    </div>
  </div>
);

const ProfileStats: React.FC = () => {
  const statCards = [
    {
      icon: <Heart className="text-pink-500" size={20} />,
      title: "Saved Recipes",
      value: "12",
      bgColor: "bg-pink-50",
      hoverColor: "bg-pink-100"
    },
    {
      icon: <ShoppingCart className="text-green-500" size={20} />,
      title: "Shopping Items",
      value: "8",
      bgColor: "bg-green-50",
      hoverColor: "bg-green-100"
    },
    {
      icon: <BarChart2 className="text-yellow-500" size={20} />,
      title: "Daily Calories",
      value: "1850",
      bgColor: "bg-yellow-50",
      hoverColor: "bg-yellow-100"
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-lg font-medium text-gray-700 mb-2">Your Activity</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            bgColor={card.bgColor}
            hoverColor={card.hoverColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;