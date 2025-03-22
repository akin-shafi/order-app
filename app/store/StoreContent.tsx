"use client";

import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore";
import RecomendationSection from "@/components/RecomendationSection";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
// import AdvertBanners from "@/components/AdvertBanners";
// import Carousel from "@/components/Carousel";

// interface BusinessInfo {
//   name: string;
//   id: string;
// }

function StoreContentInner({
  selectedCategory = null,
}: {
  selectedCategory?: string | null;
}) {
  return (
    <div className="min-h-screen relative">
      {/* Background with brand color gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff5f2] to-white"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(241,87,54,0.03)_0%,rgba(255,255,255,0)_100%)]"></div>

      {/* Subtle pattern overlay (commented out as in original) */}
      {/* <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[length:24px_24px]"></div> */}

      {/* Content */}
      <div className="relative">
        <HeaderStore  />
        <main className="max-w-6xl mx-auto px-4 pt-1 pb-8">
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoriesInStore />
          </Suspense>

          {/* Commented out Carousel */}
          {/* <Suspense
            fallback={
              <div className="h-[200px] animate-pulse bg-gray-200 rounded-xl"></div>
            }
          >
            <Carousel />
          </Suspense> */}

          {/* Commented out Advert Banners */}
          {/* <Suspense
            fallback={
              <div className="h-[200px] animate-pulse bg-gray-200 rounded-xl"></div>
            }
          >
            <AdvertBanners />
          </Suspense> */}

          <Suspense fallback={<div>Loading recommendations...</div>}>
            <RecomendationSection />
          </Suspense>

          <Suspense fallback={<>Loading featured items...</>}>
            <FeaturedStore selectedCategory={selectedCategory} />
          </Suspense>
        </main>
        <FooterStore />
      </div>
    </div>
  );
}

export default function StoreContent({
  selectedCategory,
  // businessInfo = {
  //   name: "Food Delight",
  //   id: "9d2d808d-73b1-4ede-8ead-91ace66ac59d",
  // }, // Default value for testing
}: {
  selectedCategory?: string | null;
  // businessInfo?: BusinessInfo; // Add businessInfo prop to the outer component
}) {
  return (
    <ErrorBoundary>
      <StoreContentInner
        selectedCategory={selectedCategory}
        // businessInfo={businessInfo}
      />
    </ErrorBoundary>
  );
}
