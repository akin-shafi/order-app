// import { useState } from "react";
import { Slider } from "antd";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoriesSectionProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  categories: Category[];
  isLoading?: boolean; // Add isLoading prop
}

export default function CategoriesSection({
  activeCategory,
  setActiveCategory,
  priceRange,
  setPriceRange,
  categories,
  isLoading = false,
}: CategoriesSectionProps) {
  const minPrice = 0;
  const maxPrice = 15000;

  const getProgressBarPosition = () => {
    const index = categories.findIndex((cat) => cat.id === activeCategory);
    return `${(index / (categories.length - 1)) * 100}%`;
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="h-5 w-40 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="mt-4 h-1 w-full bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mb-8 text-[#292d32]">
      <h2 className="text-xl font-bold mb-4">Categories</h2>
      <div className="flex flex-col gap-4">
        <div className="flex overflow-x-auto pb-2 -mx-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 mx-1 rounded-md text-sm whitespace-nowrap transition-colors duration-200 flex items-center justify-center
                ${
                  activeCategory === category.id
                    ? "bg-[#1A2E20] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-60">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-md font-semibold mb-2 text-[#292d32]">
            Filter by Price (Naira)
          </h3>
          <Slider
            range
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
            tooltip={{ formatter: (value) => `₦${value}` }}
            className="w-full"
          />
          <div className="mt-2 text-sm text-gray-600">
            Price Range: ₦{priceRange[0]} - ₦{priceRange[1]}
          </div>
        </div>
      </div>
      <div className="mt-4 h-1 bg-gray-200 rounded-full relative max-w-screen-md mx-auto">
        <motion.div
          className="absolute h-full bg-[#1A2E20] rounded-full"
          initial={false}
          animate={{ width: "20%", left: getProgressBarPosition() }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
