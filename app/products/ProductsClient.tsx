"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input, Pagination } from "antd";
import { useProducts } from "@/hooks/useProducts";
import { CategoryFilter } from "@/components/product/CategoryFilter";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SkeletonProductGrid } from "@/components/product/SkeletonProductGrid";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAddress } from "@/contexts/address-context";

const { Search } = Input;

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locationDetails } = useAddress(); // Fetch state and city from context
  const fixedSectionRef = useRef<HTMLDivElement>(null);
  const [fixedSectionHeight, setFixedSectionHeight] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  // Pagination and filter states
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed limit, can be made dynamic if needed
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    const categoryFromQuery = searchParams?.get("category") || undefined;
    setSelectedCategory(categoryFromQuery);
    const pageFromQuery = Number(searchParams?.get("page")) || 1;
    setPage(pageFromQuery);
  }, [searchParams]);

  // Fetch products with pagination, category, search, and address filters
  const { products, total, loading, error } = useProducts({
    page,
    limit,
    state: locationDetails?.state,
    city: locationDetails?.localGovernment,
    category: selectedCategory,
    searchTerm,
  });

  // Update URL when filters change
  useEffect(() => {
    if (!isMounted) return;

    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (page > 1) params.set("page", page.toString());
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [selectedCategory, page, router, isMounted]);

  // Handle fixed section height for spacing
  useEffect(() => {
    const updateHeight = () => {
      if (fixedSectionRef.current) {
        setFixedSectionHeight(
          fixedSectionRef.current.getBoundingClientRect().height
        );
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`);
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
              <div
                ref={fixedSectionRef}
                className="fixed top-16 left-0 right-0 z-10 bg-white p-4 max-w-6xl mx-auto"
              >
                <h1 className="text-2xl font-bold text-[#000000] mb-4">
                  Explore Our Menu
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => router.push("/store")}
                    className="flex items-center justify-center bg-[#FF6600] cursor-pointer text-white px-3 py-2 rounded-md shadow-md hover:bg-[#d9472a] transition opacity-80 hover:opacity-100"
                    style={{ height: "30px", width: "40px" }}
                  >
                    <ArrowLeft size={20} className="text-white" />
                  </button>
                  <Search
                    placeholder="Search by name, price, restaurant, or location"
                    onSearch={(value) => setSearchTerm(value)}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    enterButton
                    className="custom-search flex-1 mt-2"
                    style={{ height: "40px" }}
                  />
                </div>
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={(cat) => {
                    setSelectedCategory(cat);
                    setPage(1); // Reset to page 1 when category changes
                  }}
                />
              </div>

              <div style={{ paddingTop: `${fixedSectionHeight + 26}px` }}>
                {loading ? (
                  <SkeletonProductGrid />
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <>
                    <ProductGrid
                      products={products}
                      onAddToCart={handleAddToCart}
                    />
                    <div className="mt-6 flex justify-center">
                      <Pagination
                        current={page}
                        pageSize={limit}
                        total={total}
                        onChange={(newPage) => setPage(newPage)}
                        showSizeChanger={false}
                      />
                    </div>
                  </>
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
