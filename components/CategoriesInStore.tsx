// components/CategoriesInStore.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useCategories } from "@/hooks/useCategories";
import { CategoryTabs } from "./CategoryTabs";

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-gray-100 w-32 h-28 flex-shrink-0">
    <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-20" />
  </div>
);

export default function CategoriesInStore() {
  const router = useRouter();
  const { data: categories, isLoading, error } = useCategories();
  const [activeTab, setActiveTab] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Set the initial active tab when categories are loaded
  useEffect(() => {
    if (!categories || mounted) return;

    setMounted(true);
    const initialTab = categories[0]?.name || "Restaurants";
    setActiveTab(initialTab);
  }, [categories, mounted]);

  const handleTabChange = (categoryName: string) => {
    setActiveTab(categoryName);
  };

  const handleSubCategoryClick = (subCategoryName: string) => {
    // Redirect to /products with the subcategory as the category query parameter
    router.push(`/products?category=${encodeURIComponent(subCategoryName)}`);
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading categories. Please try again later.
      </div>
    );
  }

  const activeCategory = categories?.find((cat) => cat.name === activeTab);

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-1">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-medium text-[#292d32] mb-3 md:mb-6">
            Explore Categories
          </h2>

          {/* Category Tabs */}
          {mounted && !isLoading && categories && (
            <CategoryTabs
              categories={categories}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}

          {/* Mobile Swiper */}
          <div className="md:hidden mx-1">
            <Swiper slidesPerView={2.5} spaceBetween={12} className="px-4">
              {mounted && !isLoading && activeCategory
                ? activeCategory.subcategories.map((subcategory, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="p-2 rounded-lg cursor-pointer flex flex-col items-center justify-center w-24 h-24 bg-gray-100 hover:bg-blue-100"
                        onClick={() => handleSubCategoryClick(subcategory.name)}
                      >
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          width={32}
                          height={32}
                          className="w-10 h-10 mb-1"
                        />
                        <span className="text-gray-800 font-medium text-xs text-center">
                          {subcategory.name}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <SkeletonCategoryCard />
                      </SwiperSlide>
                    ))}
            </Swiper>
          </div>

          {/* Desktop Swiper */}
          <div className="hidden md:block mx-2">
            <Swiper slidesPerView={7.5} spaceBetween={16} className="px-4">
              {mounted && !isLoading && activeCategory
                ? activeCategory.subcategories.map((subcategory, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="p-2 rounded-lg cursor-pointer flex flex-col items-center justify-center w-28 h-28 bg-gray-100 hover:bg-blue-100"
                        onClick={() => handleSubCategoryClick(subcategory.name)}
                      >
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 mb-2"
                        />
                        <span className="text-gray-800 font-medium text-sm text-center">
                          {subcategory.name}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))
                : Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <SkeletonCategoryCard />
                      </SwiperSlide>
                    ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
