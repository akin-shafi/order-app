// components/CategoryTabs.tsx
"use client";

import { MainCategory } from "@/hooks/useCategories";
// import Image from "next/image";

interface CategoryTabsProps {
  categories: MainCategory[];
  activeTab: string;
  onTabChange: (categoryName: string) => void;
}

export function CategoryTabs({
  categories,
  activeTab,
  onTabChange,
}: CategoryTabsProps) {
  return (
    <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
            activeTab === category.name
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
          onClick={() => onTabChange(category.name)}
        >
          {/* <Image
            src={category.image}
            alt={category.name}
            width={24}
            height={24}
            className="mr-2"
          /> */}
          {category.name}
        </button>
      ))}
    </div>
  );
}
