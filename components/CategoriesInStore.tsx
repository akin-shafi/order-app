"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";

// Sample categories data (replace with your actual data)
import { categories } from "@/data/content";

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
      : "py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa]"; // Default className

  return (
    <section className={sectionClassName}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#292d32]">
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
            spaceBetween={16}
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
                  className={`bg-gray-50 p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md
                    ${index === 2 ? "ring-1 ring-[#461914]" : ""}
                `}
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
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation buttons */}
          <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg text-[#292d32] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg text-[#292d32] opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop view with grid */}
        <div className="hidden md:grid md:grid-cols-7 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`bg-gray-50 p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md hover:ring-2 ring-[#461914]
                ${index === 2 ? "ring-1 ring-[#461914]" : ""}
            `}
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

        {/* Mobile scroll indicator */}
        {/* <div className="mt-4 text-center text-xs text-gray-500 md:hidden">
          Swipe to see more categories
        </div> */}
      </div>
    </section>
  );
}
