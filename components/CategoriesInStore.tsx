"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { categories } from "@/data/content";

// Array of background colors for each slide
const backgroundColors = [
  "#FFE0E9",
  "#FFDFC7",
  "#CADBFF",
  "#A5DFC0",
  "#FFE3B2",
  "#A4D0A1",
  "#FFE3B2",
];

// Skeleton Loader Component for Categories
const SkeletonCategoryCard = () => (
  <div className="p-4 rounded-lg flex flex-col items-center animate-pulse">
    <div className="w-16 h-16 mb-2 bg-gray-200 rounded-full" />
    <div className="h-4 bg-gray-200 rounded w-20" />
  </div>
);

export default function CategoriesInStore() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Handle hydration mismatch and simulate loading
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the className based on the route
  const sectionClassName =
    pathname === "/store"
      ? "mb-2"
      : "py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa] mb-2";

  return (
    <section className={sectionClassName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between lg:items-center gap-4 mb-6">
          <h2 className="text-2xl font-medium text-[#292d32]">
            Explore Categories
          </h2>

          <Link
            href="/store"
            className="store-link bg-[#1A2E20] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm hover:bg-[#FF6600] transition-colors duration-300"
          >
            View Store
          </Link>
        </div>

        {/* Mobile view with Swiper */}
        {!mounted ? (
          <div className="md:hidden relative group">
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={18}
              slidesPerView={2.5}
              className="px-1 py-2"
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
          <div className="md:hidden relative group">
            <Swiper
              modules={[Navigation, A11y]}
              spaceBetween={18}
              slidesPerView={2.5}
              navigation={{
                prevEl: ".swiper-button-prev",
                nextEl: ".swiper-button-next",
              }}
              className="px-1 py-2"
            >
              {categories.map((category, index) => (
                <SwiperSlide key={index}>
                  <div
                    style={{
                      backgroundColor:
                        backgroundColors[index % backgroundColors.length],
                      border: index === 0 ? "" : "none",
                    }}
                    className="p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="w-16 h-16 mb-0">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-[#292d32] font-medium text-sm text-center truncate-text">
                      {category.name}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Desktop view with grid */}
        {!mounted ? (
          <div className="hidden md:grid md:grid-cols-7 gap-4">
            {Array(7)
              .fill(0)
              .map((_, index) => (
                <SkeletonCategoryCard key={index} />
              ))}
          </div>
        ) : (
          <div className="hidden md:grid md:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    backgroundColors[index % backgroundColors.length],
                  border: index === 0 ? "" : "none",
                }}
                className="p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md hover:ring-2 ring-[#1A2E20]"
              >
                <div className="w-16 h-16 mb-2">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <span className="text-[#292d32] font-medium text-sm text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
