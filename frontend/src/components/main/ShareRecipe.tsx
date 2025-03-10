import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ShareRecipe: React.FC = () => {
  return (
    <section className="container mx-auto py-10 px-4 bg-gray-100 rounded-lg mt-6 mb-6">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-2">Share Your Recipe</h3>
        <p className="text-gray-600 mb-6">Got a delicious recipe? Share it with everyone!</p>
        <Link to="/recipe/create">
          <Button className="bg-orange-500 hover:bg-orange-700">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add a New Recipe
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ShareRecipe;