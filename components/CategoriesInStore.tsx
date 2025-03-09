"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { categories } from "@/data/content";

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-gray-100 w-24 h-28">
    <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-16" />
  </div>
);

export default function CategoriesInStore() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    searchParams.get("filter")
  );

  useEffect(() => {
    setMounted(true);
    setSelectedCategory(searchParams.get("category"));
    setSelectedFilter(searchParams.get("filter"));
  }, [searchParams]);

  const handleCategoryClick = (categoryName: string) => {
    const newSelectedCategory =
      selectedCategory?.toLowerCase() === categoryName.toLowerCase()
        ? null
        : categoryName;
    setSelectedCategory(newSelectedCategory);

    const params = new URLSearchParams(searchParams.toString());
    if (newSelectedCategory) {
      params.set("category", newSelectedCategory.toLowerCase());
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterClick = (filter: string) => {
    const newSelectedFilter =
      selectedFilter?.toLowerCase() === filter.toLowerCase() ? null : filter;
    setSelectedFilter(newSelectedFilter);

    const params = new URLSearchParams(searchParams.toString());
    if (newSelectedFilter) {
      params.set("filter", newSelectedFilter.toLowerCase());
    } else {
      params.delete("filter");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const sectionClassName =
    pathname === "/store"
      ? "mb-2"
      : "py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa] mb-2";

  const getCardClassName = (categoryName: string) => {
    const baseClass =
      "flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md w-24 h-28";
    const isSelected =
      selectedCategory?.toLowerCase() === categoryName.toLowerCase();

    // Assign unique background colors based on category
    let bgColor;
    switch (categoryName.toLowerCase()) {
      case "restaurants":
        bgColor = "bg-pink-100";
        break;
      case "supermarkets":
        bgColor = "bg-orange-100";
        break;
      case "pharmacy":
        bgColor = "bg-blue-100";
        break;
      case "local markets":
        bgColor = "bg-green-100";
        break;
      case "african meals":
        bgColor = "bg-yellow-100";
        break;
      case "fit fam":
        bgColor = "bg-teal-100";
        break;
      case "drinks":
        bgColor = "bg-purple-100";
        break;
      default:
        bgColor = "bg-gray-100";
    }

    return `${baseClass} ${bgColor} ${
      isSelected ? "ring-2 ring-[#FF6600] bg-[#FFF5E6]" : ""
    }`;
  };

  const FilterButtons = () => {
    const getFilterButtonClassName = (filter: string) => {
      const baseClass =
        "px-4 py-2 rounded-full font-medium text-sm text-center cursor-pointer transition-all duration-300 relative overflow-hidden group";
      const isSelected = selectedFilter?.toLowerCase() === filter.toLowerCase();
      return `${baseClass} ${
        isSelected
          ? "bg-gradient-to-r from-[#000000] to-[#2E7D32] text-white"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      } ${
        isSelected
          ? "shadow-lg shadow-[#000000]/20"
          : "shadow-md hover:shadow-lg"
      } before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#FF6600] before:to-[#FF8F00] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-20`;
    };

    return (
      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        {["My Favorite", "Deliver Now", "On Schedule"].map((filter) => (
          <button
            key={filter}
            className={getFilterButtonClassName(filter)}
            onClick={() => handleFilterClick(filter)}
          >
            <span className="relative z-10">{filter}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <section className={sectionClassName}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Explore Categories
          </h2>

          {/* Mobile: Horizontal scrolling container */}
          <div className="md:hidden">
            {mounted ? (
              <div className="overflow-x-auto scrollbar-hide py-4 px-2">
                <div className="flex space-x-4">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className={getCardClassName(category.name)}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="w-12 h-12 mb-2 flex justify-center">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-gray-800 font-medium text-sm text-center whitespace-nowrap">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4 py-4 px-2">
                {Array(7)
                  .fill(0)
                  .map((_, index) => (
                    <SkeletonCategoryCard key={index} />
                  ))}
              </div>
            )}
          </div>

          {/* Desktop: Evenly spaced grid */}
          <div className="hidden md:flex justify-between gap-4">
            {mounted
              ? categories.map((category, index) => (
                  <div
                    key={index}
                    className={getCardClassName(category.name)}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="w-12 h-12 mb-2 flex justify-center">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-gray-800 font-medium text-sm text-center whitespace-nowrap">
                      {category.name}
                    </span>
                  </div>
                ))
              : Array(7)
                  .fill(0)
                  .map((_, index) => <SkeletonCategoryCard key={index} />)}
          </div>

          {/* Filter Buttons with Gradient Glow */}
          {mounted && <FilterButtons />}

          {/* Ad Section */}
          <div className="container mx-auto px-0 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ad 1 */}
              <div className="bg-green-800 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/advert-1.png"
                  alt="Chow Combo Offer"
                  width={600}
                  height={192}
                  className="w-full object-cover"
                />
              </div>

              {/* Ad 2 */}
              <div className="bg-red-900 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/advert-2.png"
                  alt="Relay Package Delivery"
                  width={600}
                  height={192}
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
