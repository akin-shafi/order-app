"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { categories } from "@/data/content";

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-gray-100 w-32 h-28 flex-shrink-0">
    <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-20" />
  </div>
);

export default function CategoriesInStore() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams?.get("category") || null
  );

  useEffect(() => {
    setMounted(true);
    setSelectedCategory(searchParams?.get("category") || null);
  }, [searchParams]);

  const handleCategoryClick = (categoryName: string) => {
    const newSelectedCategory =
      selectedCategory?.toLowerCase() === categoryName.toLowerCase()
        ? null
        : categoryName;
    setSelectedCategory(newSelectedCategory);

    const params = new URLSearchParams(searchParams?.toString() || "");
    if (newSelectedCategory) {
      params.set("category", newSelectedCategory.toLowerCase());
    } else {
      params.delete("category");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const sectionClassName =
    pathname === "/store"
      ? "mb-2"
      : "py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa] mb-2";

  const getCardClassName = (categoryName: string, index: number) => {
    const baseClass =
      "flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md w-32 h-28 flex-shrink-0"; // Increased from w-24 to w-32
    const isSelected =
      selectedCategory?.toLowerCase() === categoryName.toLowerCase();

    const bgColors = [
      "bg-pink-100",
      "bg-orange-100",
      "bg-blue-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-teal-100",
      "bg-purple-100",
      "bg-indigo-100",
      "bg-red-100",
      "bg-cyan-100",
    ];

    const bgColor = bgColors[index % bgColors.length] || "bg-gray-100";

    return `${baseClass} ${bgColor} ${
      isSelected ? "ring-2 ring-[#FF6600] bg-[#FFF5E6]" : ""
    }`;
  };

  return (
    <section className={sectionClassName}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 py-4">
            Explore Categories
          </h2>

          {/* Mobile: Swiper for small screens */}
          <div className="md:hidden">
            {mounted ? (
              <Swiper
                slidesPerView={2.5} // Show 2.5 items at a glance
                spaceBetween={16} // Gap between slides
                className="py-4 px-2"
              >
                {categories.map((category, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={getCardClassName(category.name, index)}
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
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Swiper
                slidesPerView={2.5}
                spaceBetween={16}
                className="py-4 px-2"
              >
                {Array(7)
                  .fill(0)
                  .map((_, index) => (
                    <SwiperSlide key={index}>
                      <SkeletonCategoryCard />
                    </SwiperSlide>
                  ))}
              </Swiper>
            )}
          </div>

          {/* Desktop: Evenly spaced grid */}
          <div className="hidden md:flex justify-between gap-4">
            {mounted
              ? categories.map((category, index) => (
                  <div
                    key={index}
                    className={getCardClassName(category.name, index)}
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

          <div className="container mx-auto px-0 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-800 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/advert-1.png"
                  alt="Chow Combo Offer"
                  width={600}
                  height={192}
                  className="w-full object-cover"
                  priority
                />
              </div>
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