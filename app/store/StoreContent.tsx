// app/store/StoreContent.tsx
"use client";

import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore";
import RecomendationSection from "@/components/RecomendationSection";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { useState } from "react";

interface StoreContentProps {
  initialBusinessType?: string | null; // Renamed from selectedCategory
}

export default function StoreContent({
  initialBusinessType,
}: StoreContentProps) {
  const [activeBusinessType] = useState<string>(
    initialBusinessType || "Restaurants"
  );
  const [selectedSubCategory] = useState<string | null>(null);

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff5f2] to-white"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(241,87,54,0.03)_0%,rgba(255,255,255,0)_100%)]"></div>

        <div className="relative">
          <HeaderStore />
          <main className="max-w-6xl mx-auto px-4 pt-1 pb-8">
            <Suspense fallback={<div>Loading categories...</div>}>
              <CategoriesInStore />
            </Suspense>

            <Suspense fallback={<div>Loading recommendations...</div>}>
              <RecomendationSection
                activeBusinessType={activeBusinessType} // Renamed from activeCategory
                selectedSubCategory={selectedSubCategory}
              />
            </Suspense>

            <Suspense fallback={<>Loading featured items...</>}>
              <FeaturedStore
                activeBusinessType={activeBusinessType} // Renamed from activeCategory
                selectedSubCategory={selectedSubCategory}
              />
            </Suspense>
          </main>
          <FooterStore />
        </div>
      </div>
    </ErrorBoundary>
  );
}
