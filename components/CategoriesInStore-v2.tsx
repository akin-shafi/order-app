"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Rate, Input } from "antd";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/hooks/useProducts";
import { CategoryTabs } from "./CategoryTabs";
import { useAddress } from "@/contexts/address-context";
import { useBusiness } from "@/hooks/useBusiness";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-gray-100 w-32 h-28 flex-shrink-0">
    <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-20" />
  </div>
);

export default function CategoriesInStore() {
  const { data: categories, isLoading, error } = useCategories();
  const { locationDetails, address } = useAddress();
  const [activeTab, setActiveTab] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filter, setFilter] = useState<"fastest" | "lowest" | "rated">(
    "fastest"
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { businesses } = useBusiness({
    address: address || "",
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    businessType: activeTab || "Restaurants",
  });

  useEffect(() => {
    if (!categories || mounted) return;
    setMounted(true);
    const initialTab = categories[0]?.name || "Restaurants";
    setActiveTab(initialTab);
  }, [categories, mounted]);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: [
      "products",
      selectedCategory,
      locationDetails?.state,
      locationDetails?.localGovernment,
      searchTerm,
    ],
    queryFn: () =>
      fetchProducts({
        page: 1,
        limit: 10,
        state: locationDetails?.state,
        city: locationDetails?.localGovernment,
        category: selectedCategory || "",
        searchTerm: searchTerm,
      }),
    enabled: isModalOpen && !!selectedCategory,
  });

  const products = productsData?.products || [];

  const handleTabChange = (categoryName: string) => {
    setActiveTab(categoryName);
  };

  const handleSubCategoryClick = (subCategoryName: string) => {
    setSelectedCategory(subCategoryName);
    setIsModalOpen(true);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const calculateDeliveryFee = (businessCity: string) => {
    const userCity = locationDetails?.localGovernment || "";
    return businessCity === userCity ? 600 : 1200;
  };

  const getBusinessId = (businessName: string) => {
    const business = businesses.find((b) => b.name === businessName);
    return business?.id || "";
  };

  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filter === "fastest") {
      const aTime = parseInt(
        a.business.deliveryTimeRange?.split("-")[0] || "999"
      );
      const bTime = parseInt(
        b.business.deliveryTimeRange?.split("-")[0] || "999"
      );
      return aTime - bTime;
    } else if (filter === "lowest") {
      const aTotal =
        parseFloat(a.price) + calculateDeliveryFee(a.business.city);
      const bTotal =
        parseFloat(b.price) + calculateDeliveryFee(b.business.city);
      return aTotal - bTotal;
    } else if (filter === "rated") {
      const aRating = parseFloat(a.business.rating || "0");
      const bRating = parseFloat(b.business.rating || "0");
      return bRating - aRating;
    }
    return 0;
  });

  const modalVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.2 } },
  };

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error loading categories. Please try again later.
      </div>
    );
  }

  const activeCategory = categories?.find((cat) => cat.name === activeTab);

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-1">
        <div className="max-w-6xl mx-auto">
          {/* Category Tabs */}
          {mounted && !isLoading && categories && (
            <CategoryTabs
              categories={categories}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}
          <div className="flex flex-row items-center space-x-4 mb-6">
            <h2 className="text-xl md:text-2xl font-medium text-[#292d32] flex items-center">
              <Image
                src="/best-deal.png"
                alt="Best Deal"
                width={50}
                height={50}
                className="md:w-24 "
              />
            </h2>
            <div className="text-gray-500 pr-2 py-2 text-sm font-medium">
              Click a category below to get the best deal
            </div>
          </div>

          {/* Mobile Swiper */}
          <div className="md:hidden mx-1">
            <Swiper slidesPerView={2.5} spaceBetween={12} className="px-4">
              {mounted && !isLoading && activeCategory
                ? activeCategory.subcategories.map((subcategory, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="p-2 rounded-lg cursor-pointer flex flex-col items-center justify-center w-24 h-24 bg-gray-100 hover:bg-blue-100"
                        onClick={() => handleSubCategoryClick(subcategory.name)}
                      >
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          width={32}
                          height={32}
                          className="w-10 h-10 mb-1"
                        />
                        <span className="text-gray-800 font-medium text-xs text-center">
                          {subcategory.name}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))
                : Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <SkeletonCategoryCard />
                      </SwiperSlide>
                    ))}
            </Swiper>
          </div>

          {/* Desktop Swiper */}
          <div className="hidden md:block mx-2">
            <Swiper slidesPerView={7.5} spaceBetween={16} className="px-4">
              {mounted && !isLoading && activeCategory
                ? activeCategory.subcategories.map((subcategory, index) => (
                    <SwiperSlide key={index}>
                      <div
                        className="p-2 rounded-lg cursor-pointer flex flex-col items-center justify-center w-28 h-28 bg-gray-100 hover:bg-blue-100"
                        onClick={() => handleSubCategoryClick(subcategory.name)}
                      >
                        <Image
                          src={subcategory.image || "/placeholder.svg"}
                          alt={subcategory.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 mb-2"
                        />
                        <span className="text-gray-800 font-medium text-sm text-center">
                          {subcategory.name}
                        </span>
                      </div>
                    </SwiperSlide>
                  ))
                : Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <SwiperSlide key={index}>
                        <SkeletonCategoryCard />
                      </SwiperSlide>
                    ))}
            </Swiper>
          </div>
        </div>
      </div>

      {/* Full-screen Modal with Left Slide Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-start"
            onClick={handleBackdropClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-[480px] bg-white h-full fixed top-0 left-0 md:w-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#292d32]">
                  Products in {selectedCategory}
                </h2>
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                >
                  <X
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              </div>

              <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
                {productsLoading ? (
                  <div className="text-center text-gray-500 py-4">
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No products found for this category.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <Input
                      placeholder="Search for restaurant"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyUp={handleKeyPress}
                      suffix={
                        <button
                          onClick={handleSearch}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          🔍
                        </button>
                      }
                      className="rounded-lg border-gray-300 text-sm"
                    />

                    {/* Filter Tabs */}
                    <div className="flex justify-start gap-2 overflow-x-auto">
                      <button
                        onClick={() => setFilter("fastest")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                          filter === "fastest"
                            ? "bg-[#FF6600] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Fastest Delivery +10pts
                      </button>
                      <button
                        onClick={() => setFilter("lowest")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                          filter === "lowest"
                            ? "bg-[#4CAF50] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Lower price
                      </button>
                      <button
                        onClick={() => setFilter("rated")}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                          filter === "rated"
                            ? "bg-[#2196F3] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Most Rated
                      </button>
                    </div>

                    {/* Product List */}
                    <div className="space-y-4">
                      {sortedProducts.map((product) => {
                        const deliveryFee = calculateDeliveryFee(
                          product.business.city
                        );
                        const price = parseFloat(product.price);
                        const totalCost = price + deliveryFee;
                        const businessId = getBusinessId(product.business.name);

                        return (
                          <div
                            key={product.id}
                            className="flex items-center justify-between border-b border-gray-200 pb-4"
                          >
                            <div className="flex items-center gap-3">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                width={60}
                                height={60}
                                className="w-14 h-14 object-cover rounded-full"
                              />
                              <div>
                                <p className="text-sm font-semibold text-[#292d32]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.business.name}
                                </p>
                                <p className="text-xs font-medium text-[#292d32]">
                                  ₦{price} + ₦{deliveryFee} Delivery = ₦
                                  {totalCost}
                                </p>
                                {product.business.rating && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Rate
                                      disabled
                                      value={
                                        isNaN(
                                          parseFloat(product.business.rating)
                                        )
                                          ? 0
                                          : parseFloat(product.business.rating)
                                      }
                                      style={{ fontSize: 9, color: "#FF6600" }}
                                    />
                                    <span>({product.business.rating})</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Link
                              href={businessId ? `/store/${businessId}` : "#"}
                              className={`px-3 py-1 rounded-full text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                                !businessId && "cursor-not-allowed opacity-50"
                              }`}
                            >
                              Order Now
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
