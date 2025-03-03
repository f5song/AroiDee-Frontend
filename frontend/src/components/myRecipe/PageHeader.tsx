// components/myRecipe/PageHeader.tsx
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const PageHeader: React.FC = () => {

  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/recipe/create');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          👨‍🍳 My Recipe Collection
        </h1>
        <p className="text-gray-500">
          Manage your personal recipes and favorites
        </p>
      </div>

      <div className="mt-4 md:mt-0">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleClick}>
          <PlusCircle className="w-4 h-4 mr-2" /> Create New Recipe
          
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;