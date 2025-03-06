"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { categories } from "@/data/content";
import "swiper/css";
import "swiper/css/navigation";

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-white w-[120px]">
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
      "p-3 rounded-lg flex flex-col items-center cursor-pointer transition-all shadow-md hover:ring-2 hover:ring-[#FF6600] bg-white w-[120px]";
    return selectedCategory?.toLowerCase() === categoryName.toLowerCase()
      ? `${baseClass} ring-2 ring-[#FF6600] bg-[#FFF5E6]` // Active state
      : baseClass;
  };

  const getFilterButtonClassName = (filter: string) => {
    const baseClass =
      "p-4 rounded-full text-[#292d32] font-medium text-md md:text-sm text-center truncate-text cursor-pointer transition-colors";
    return selectedFilter?.toLowerCase() === filter.toLowerCase()
      ? `${baseClass} bg-[#1A2E20] text-white`
      : `${baseClass} bg-[#D7F2DF] text-[#292d32] hover:bg-gray-300`;
  };

  return (
    <section className={sectionClassName}>
      <div className="max-w-6xl mx-auto">
        {/* Mobile: Swiper with 2.5 items */}
        {!mounted ? (
          <div className="md:hidden">
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={20}
              slidesPerView={2.5}
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
          </div>
        ) : (
          <div className="md:hidden">
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={20}
              slidesPerView={2.5}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              className="py-4 px-2"
            >
              {categories.map((category, index) => (
                <SwiperSlide key={index}>
                  <div
                    className={getCardClassName(category.name)}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="w-12 h-12 mb-0 flex justify-center">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={48}
                        height={48}
                        className="object-contain w-auto h-auto"
                      />
                    </div>
                    <span className="text-[#292d32] font-medium text-md md:text-sm text-center truncate-text">
                      {category.name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Desktop: Spread all items across screen width */}
        {!mounted ? (
          <div className="hidden md:flex justify-between gap-4">
            {Array(7)
              .fill(0)
              .map((_, index) => (
                <SkeletonCategoryCard key={index} />
              ))}
          </div>
        ) : (
          <div className="hidden md:flex justify-between gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={getCardClassName(category.name)}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="w-12 h-12 mb-0 flex justify-center">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="object-contain w-auto h-auto"
                  />
                </div>
                <span className="text-[#292d32] font-medium text-md md:text-sm text-center truncate-text">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Filter Buttons */}
        {mounted && (
          <div className="mt-4 flex justify-center gap-4">
            <button
              className={getFilterButtonClassName("My Favorite")}
              onClick={() => handleFilterClick("My Favorite")}
            >
              My Favorite
            </button>
            <button
              className={getFilterButtonClassName("Deliver Now")}
              onClick={() => handleFilterClick("Deliver Now")}
            >
              Deliver Now
            </button>
            <button
              className={getFilterButtonClassName("On Schedule")}
              onClick={() => handleFilterClick("On Schedule")}
            >
              On Schedule
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
