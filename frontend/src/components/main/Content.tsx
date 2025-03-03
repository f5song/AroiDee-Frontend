import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RecipeCard from "./RecipeCard";

interface Recipe {
    title: string;
    author: string;
    image: string;
    cookTime: string;
    calories: number;
    rating: number;
    ingredients: string[];
    isFavorite: boolean;
}

interface ContentProps {
    topic?: string;
    recipes: Recipe[];
    toggleFavorite: (index: number) => void;
}

const Content: React.FC<ContentProps> = ({ topic, recipes, toggleFavorite }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
    };

    return (
        <section className="container mx-auto py-6 px-4 relative">
            {/* Topic Title */}
            {topic && <h3 className="text-3xl font-bold mb-4">{topic}</h3>}

            {/* Recipe Carousel Container */}
            <div className="relative">
                {/* Scrollable Recipe List */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
                >

                    {recipes.map((recipe, index) => (
                        <motion.div key={index} className="snap-center flex-shrink-0 w-[320px]">
                            <RecipeCard recipe={recipe} onToggleFavorite={() => toggleFavorite(index)} />
                        </motion.div>
                    ))}
                </div>

                {/* Arrow Navigation */}
                {recipes.length > 3 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition"
                        >
                            <ArrowRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default Content;
