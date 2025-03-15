"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { categories } from "@/data/content";

// Assuming categories is imported from your data file
export default function CategoriesSection() {
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#292d32]">
            Explore Categories
          </h2>
          {/* <Link
            href="#"
            className="bg-[#210603] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm"
          >
            Visit Store
          </Link> */}
        </div>

        <div className="relative group">
          {/* Custom navigation buttons */}
          <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg text-[#292d32] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-4">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg text-[#292d32] opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4">
            <ChevronRight className="w-5 h-5" />
          </button>

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={2}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletActiveClass: "bg-[#f15736] w-6",
              bulletClass:
                "inline-block h-1 w-4 bg-gray-300 rounded-full transition-all duration-300 mx-1",
              renderBullet: (_, className) => {
                return `<span class="${className}"></span>`;
              },
            }}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            className="px-2 py-4"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer group/item">
                  <div className="relative w-full aspect-square mb-0 flex justify-center items-center">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={100}
                      height={100}
                      className="object-contain group-hover/item:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="text-center">
                    <h3 className="text-[#292d32] font-medium text-sm">
                      {category.name}
                    </h3>
                    {/* <p className="text-[#676767] text-xs mt-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                      {Math.floor(Math.random() * 50) + 20} items
                    </p> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom pagination */}
          <div className="swiper-pagination flex justify-center space-x-2 mt-6" />
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <div className="mt-4 text-center text-sm text-[#676767] md:hidden">
        <span>Swipe to explore more categories</span>
      </div>
    </section>
  );
}
