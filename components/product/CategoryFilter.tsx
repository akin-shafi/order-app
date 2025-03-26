// components/product/CategoryFilter.tsx
"use client";

import React from "react";

const categories = [
  { name: "All" }, // Added "All" option
  { name: "Beans Combo" },
  { name: "Rice Dishes" },
  { name: "Swallows" },
  { name: "Small Chops" },
  { name: "Fast Meals" },
  { name: "Desserts" },
  { name: "Drinks" },
  { name: "Soups" },
];

interface CategoryFilterProps {
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() =>
            onCategoryChange(
              selectedCategory === category.name
                ? undefined
                : category.name === "All"
                ? undefined // "All" resets the category filter
                : category.name
            )
          }
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
            selectedCategory === category.name ||
            (category.name === "All" && !selectedCategory) // Highlight "All" when no category is selected
              ? "bg-[#FF6600] text-white"
              : "bg-gray-200 text-[#000000] hover:bg-[#FF6600] hover:text-white"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
