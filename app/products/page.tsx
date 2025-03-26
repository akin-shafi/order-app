// pages/products.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import { useProducts } from "@/hooks/useProducts";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ProductGrid } from "@/components/product/ProductGrid";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSearchParams, useRouter } from "next/navigation";

const { Search } = Input;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fixedSectionRef = useRef<HTMLDivElement>(null);
  const [fixedSectionHeight, setFixedSectionHeight] = useState<number>(0);

  // Safely get the category from the URL query parameter
  const initialCategory = searchParams
    ? searchParams.get("category") || undefined
    : undefined;

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategory
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { products, loading, error } = useProducts({
    category: selectedCategory,
    searchTerm,
  });

  // Update the URL when the selected category changes
  useEffect(() => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [selectedCategory, router, searchParams]);

  // Calculate the height of the fixed section dynamically
  useEffect(() => {
    const updateHeight = () => {
      if (fixedSectionRef.current) {
        const height = fixedSectionRef.current.getBoundingClientRect().height;
        setFixedSectionHeight(height);
      }
    };

    updateHeight(); // Initial calculation
    window.addEventListener("resize", updateHeight); // Update on resize

    return () => window.removeEventListener("resize", updateHeight); // Cleanup
  }, []);

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
    // Implement cart logic here
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fff5f2] to-white"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(241,87,54,0.03)_0%,rgba(255,255,255,0)_100%)]"></div>

        <div className="relative">
          <HeaderStore />
          <main className="max-w-6xl mx-auto px-4 pt-1 pb-8">
            <div className="container">
              {/* Fixed Search and Category Filter */}
              <div
                ref={fixedSectionRef}
                className="fixed top-16 left-0 right-0 z-10 bg-white shadow-md p-4 max-w-6xl mx-auto"
                // className="relative top-16 left-0 right-0  bg-white shadow-md p-4 max-w-6xl mx-auto"
              >
                <h1 className="text-2xl font-bold text-[#000000] mb-4">
                  Explore Our Menu
                </h1>

                {/* Search Bar */}
                <Search
                  placeholder="Search by name, price, restaurant, or location"
                  onSearch={(value) => setSearchTerm(value)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ marginBottom: 16 }}
                  enterButton
                  className="custom-search"
                />

                {/* Category Filter */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {/* Spacer to prevent content from being hidden under fixed elements */}
              <div style={{ paddingTop: `${fixedSectionHeight + 16}px` }}>
                {/* Product Grid */}
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <ProductGrid
                    products={products}
                    onAddToCart={handleAddToCart}
                  />
                )}
              </div>
            </div>
          </main>
          <FooterStore />
        </div>
      </div>
    </ErrorBoundary>
  );
}
