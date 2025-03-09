"use client";

// import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore";
import { useSearchParams } from "next/navigation";
import RecommendedForYou from "@/components/RecomendationSection";

export default function StorePage() {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") ?? null; // Safely handle null with optional chaining and nullish coalescing

  return (
    <div className="min-h-screen bg-white">
      {/* <HeaderStore restaurantName={""} /> */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <CategoriesInStore />
        <RecommendedForYou />
        <FeaturedStore selectedCategory={category} />
      </main>
      <FooterStore />
    </div>
  );
}
