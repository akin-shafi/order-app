"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { categories } from "@/data/content";

// Array of background colors for each slide
const backgroundColors = [
  "#FFF0F5",
  "#FFF3ED",
  "#EBF4FF",
  "#DCF7ED",
  "#FFF8E4",
  "#DAEFE3",
  "#FFF8E4",
];

export default function CategoriesInStore() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname(); // Get the current route

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determine the className based on the route
  const sectionClassName =
    pathname === "/store"
      ? "mb-2" // If the route is /store
      : "py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa] mb-2"; // Default className

  return (
    <section className={sectionClassName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between lg:items-center gap-4 mb-6">
          <h2 className="text-2xl font-medium  text-[#292d32]">
            Explore Categories
          </h2>

          <Link
            href="/store"
            className="store-link bg-[#461914] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm hover:bg-[#F15736] transition-colors duration-300"
          >
            View Store
          </Link>
        </div>

        {/* Mobile view with Swiper */}
        <div className="md:hidden relative group">
          <Swiper
            modules={[Navigation, A11y]}
            spaceBetween={18}
            slidesPerView={2.6}
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
                    border: index === 0 ? "2px solid #FF97B9" : "none", // Add border to the first item
                  }}
                  className={`p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md`}
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
                  <span className="text-[#292d32] font-medium text-sm text-center">
                    {category.name}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop view with grid */}
        <div className="hidden md:grid md:grid-cols-7 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                backgroundColor:
                  backgroundColors[index % backgroundColors.length],
                border: index === 0 ? "2px solid #FF97B9" : "none", // Add border to the first item
              }}
              className={`p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md hover:ring-2 ring-[#461914]`}
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
      </div>
    </section>
  );
}
