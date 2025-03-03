import React from "react";
import { Button } from "@/components/ui/button";

// Sample data for latest recipes
const latestRecipes = [
  {
    id: 1,
    title: "Caramel Strawberry Milkshake",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Cashew Vegan Rice",
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Smoked Salmon Salad Sandwich",
    image: "/api/placeholder/300/200"
  },
  {
    id: 4,
    title: "Salmon in Creamy Sun Dried Tomato Sauce",
    image: "/api/placeholder/300/200"
  },
  {
    id: 5,
    title: "Healthy Jam Waffle Breakfast",
    image: "/api/placeholder/300/200"
  },
  {
    id: 6,
    title: "Chocolate and Banana Jar Cake",
    image: "/api/placeholder/300/200"
  },
  {
    id: 7,
    title: "Caramel Blueberry Scones",
    image: "/api/placeholder/300/200"
  },
  {
    id: 8,
    title: "Blueberry Carrot Cake",
    image: "/api/placeholder/300/200"
  },
  {
    id: 9,
    title: "Vegan Cauliflower Salad",
    image: "/api/placeholder/300/200"
  },
  {
    id: 10,
    title: "Roasted Red Pepper Soup",
    image: "/api/placeholder/300/200"
  },
  {
    id: 11,
    title: "Eggs and Avocado Toast",
    image: "/api/placeholder/300/200"
  },
  {
    id: 12,
    title: "Pork Shoulder Cashew Noodles",
    image: "/api/placeholder/300/200"
  },
  {
    id: 13,
    title: "Toasted Farfalle in Pesto Sauce",
    image: "/api/placeholder/300/200"
  },
  {
    id: 14,
    title: "Cheesy Bacon Burger Sliders",
    image: "/api/placeholder/300/200"
  },
  {
    id: 15,
    title: "Fig and Raisins Oatmeal",
    image: "/api/placeholder/300/200"
  },
  {
    id: 16,
    title: "Silky Smooth Panna Cotta",
    image: "/api/placeholder/300/200"
  }
];

const LatestRecipes = () => {
  return (
    <section className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Latest Recipes</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {latestRecipes.map((recipe) => (
          <div key={recipe.id} className="group cursor-pointer">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 mb-2">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Recipe Title */}
            <h3 className="text-sm font-medium line-clamp-2">{recipe.title}</h3>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="mt-8 text-center">
        <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
          Load More
        </Button>
      </div>
    </section>
  );
};

export default LatestRecipes;