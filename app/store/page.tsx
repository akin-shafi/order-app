/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore";

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderStore /> {/* No props needed */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <CategoriesInStore />
        <FeaturedStore /> {/* Removed deliveryAddress prop */}
      </main>
      <FooterStore />
    </div>
  );
}
