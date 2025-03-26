// "use client";
// import React from "react";

// const categories = [
//   { name: "All" },
//   { name: "Beans Combo" },
//   { name: "Rice Dishes" }, // Update these to match your backend categories
//   { name: "Swallows" },
//   { name: "Small Chops" },
//   { name: "Fast Meals" },
//   { name: "Desserts" },
//   { name: "Drinks" },
//   { name: "Soups" },
// ];

// interface CategoryFilterProps {
//   selectedCategory: string | undefined;
//   onCategoryChange: (category: string | undefined) => void;
// }

// export const CategoryFilter: React.FC<CategoryFilterProps> = ({
//   selectedCategory,
//   onCategoryChange,
// }) => {
//   return (
//     <div className="flex flex-wrap gap-2 mb-4">
//       {categories.map((category) => (
//         <button
//           key={category.name}
//           onClick={() =>
//             onCategoryChange(
//               selectedCategory === category.name
//                 ? undefined
//                 : category.name === "All"
//                 ? undefined
//                 : category.name
//             )
//           }
//           className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
//             selectedCategory === category.name ||
//             (category.name === "All" && !selectedCategory)
//               ? "bg-[#FF6600] text-white"
//               : "bg-gray-200 text-[#000000] hover:bg-[#FF6600] hover:text-white"
//           }`}
//         >
//           {category.name}
//         </button>
//       ))}
//     </div>
//   );
// };


"use client";
import React, { useState, useEffect } from "react";
import { fetchProductCategories } from "@/hooks/useProducts"; // Adjust path to your fetch function

interface CategoryFilterProps {
  selectedCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const [categories, setCategories] = useState<{ name: string }[]>([
    { name: "All" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const fetchedCategories = await fetchProductCategories(); // No token needed here
        const formattedCategories = [
          { name: "All" },
          ...fetchedCategories.map((cat: { name: string }) => ({
            name: cat.name,
          })),
        ];
        setCategories(formattedCategories);
      } catch (err) {
        // Check if err is an Error instance
        if (err instanceof Error) {
          setError(err.message || "Failed to load categories");
        } else {
          setError("Failed to load categories");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []); // Empty dependency array since token is handled by the hook

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
                ? undefined
                : category.name
            )
          }
          className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${
            selectedCategory === category.name ||
            (category.name === "All" && !selectedCategory)
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
