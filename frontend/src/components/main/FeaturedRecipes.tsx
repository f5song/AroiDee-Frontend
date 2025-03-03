import React from "react";
import { Star } from "lucide-react";

// Sample data for featured recipes
const featuredRecipes = [
  {
    id: 1,
    title: "Delicious Fancy Glazed Blueberry Donuts",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 458
  },
  {
    id: 2,
    title: "Pan Fried Cod in Creamy Kale Sauce",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 458
  },
  {
    id: 3,
    title: "Berry Maddiness Biscuits",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 436
  },
  {
    id: 4,
    title: "Four Ingredient Oatmeal Pancakes",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 456
  },
  {
    id: 5,
    title: "Pumpkin Marshmallow Pie and Nuts",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 458
  },
  {
    id: 6,
    title: "Mighty Cheesy Breakfast Burger",
    image: "/api/placeholder/400/300",
    author: "Tricia Albert",
    rating: 5,
    timePosted: "Yesterday",
    views: 438
  }
];

const FeaturedRecipes = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Super Delicious</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="p-4">
              {/* Rating stars */}
              <div className="flex text-orange-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500" />
                ))}
              </div>
              
              {/* Recipe title */}
              <h3 className="font-medium text-lg mb-1 line-clamp-2">{recipe.title}</h3>
              
              {/* Author with avatar */}
              <div className="flex items-center mt-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                  <img 
                    src="/api/placeholder/30/30" 
                    alt={recipe.author} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600">{recipe.author}</span>
              </div>
              
              {/* Meta information */}
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <div className="flex items-center">
                  <span className="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span>{recipe.timePosted}</span>
                </div>
                
                <div className="flex items-center ml-4">
                  <span className="mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </span>
                  <span>{recipe.views}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRecipes;