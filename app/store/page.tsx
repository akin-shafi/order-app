"use client";

import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function StorePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="min-h-screen bg-white">
      <HeaderStore />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <CategoriesInStore />
        <FeaturedStore selectedCategory={category} />
      </main>
      <FooterStore />
    </div>
  );
}
