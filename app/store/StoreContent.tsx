"use client";

import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore";
import { useSearchParams } from "next/navigation";
import RecommendedForYou from "@/components/RecomendationSection";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import AdvertBanners from "@/components/AdvertBanners";

function StoreContentInner() {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") ?? null;

  return (
    <div className="min-h-screen relative">
      {/* Background with brand color gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff5f2] to-white"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(241,87,54,0.03)_0%,rgba(255,255,255,0)_100%)]"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[length:24px_24px]"></div>

      {/* Content */}
      <div className="relative">
        <HeaderStore restaurantName={""} />
        <main className="max-w-6xl mx-auto px-4 pt-1 pb-8">
          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoriesInStore />
          </Suspense>

          {/* Animated Advert Banners */}
          <Suspense
            fallback={
              <div className="h-[200px] animate-pulse bg-gray-200 rounded-xl"></div>
            }
          >
            <AdvertBanners />
          </Suspense>

          <Suspense fallback={<div>Loading recommendations...</div>}>
            <RecommendedForYou />
          </Suspense>

          <Suspense fallback={<div>Loading featured items...</div>}>
            <FeaturedStore selectedCategory={category} />
          </Suspense>
        </main>
        <FooterStore />
      </div>
    </div>
  );
}

export default function StoreContent() {
  return (
    <ErrorBoundary>
      <StoreContentInner />
    </ErrorBoundary>
  );
}
