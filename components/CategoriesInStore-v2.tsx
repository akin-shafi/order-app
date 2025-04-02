"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Modal, Rate } from "antd";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/hooks/useProducts";
import { CategoryTabs } from "./CategoryTabs";
import { useAddress } from "@/contexts/address-context";
import { useBusiness } from "@/hooks/useBusiness";

// Custom CSS for left-slide animation
const modalStyles = `
  .slide-in-left .ant-modal {
    left: -100%;
    transition: left 0.3s ease-in-out;
  }
  .slide-in-left.ant-modal-open .ant-modal {
    left: 0;
  }
  .ant-modal-mask {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

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
  const [filter, setFilter] = useState<"fastest" | "lowest" | "rated">("fastest");

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
    queryKey: ["products", selectedCategory, locationDetails?.state, locationDetails?.localGovernment],
    queryFn: () =>
      fetchProducts({
        page: 1,
        limit: 10,
        state: locationDetails?.state,
        city: locationDetails?.localGovernment,
        category: selectedCategory || "",
        searchTerm: "",
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

  const calculateDeliveryFee = (businessCity: string) => {
    const userCity = locationDetails?.localGovernment || "";
    return businessCity === userCity ? 600 : 1200;
  };

  const getBusinessId = (businessName: string) => {
    const business = businesses.find((b) => b.name === businessName);
    return business?.id || "";
  };

  // Sort products based on filter
  const sortedProducts = [...products].sort((a, b) => {
    if (filter === "fastest") {
      const aTime = parseInt(a.business.deliveryTimeRange?.split("-")[0] || "999");
      const bTime = parseInt(b.business.deliveryTimeRange?.split("-")[0] || "999");
      return aTime - bTime;
    } else if (filter === "lowest") {
      const aTotal = parseFloat(a.price) + calculateDeliveryFee(a.business.city);
      const bTotal = parseFloat(b.price) + calculateDeliveryFee(b.business.city);
      return aTotal - bTotal;
    } else if (filter === "rated") {
      const aRating = parseFloat(a.business.rating || "0");
      const bRating = parseFloat(b.business.rating || "0");
      return bRating - aRating; // Higher rating first
    }
    return 0;
  });

  const fastest = sortedProducts[0];
  const lowest = products.reduce((min, p) => {
    const pTotal = parseFloat(p.price) + calculateDeliveryFee(p.business.city);
    const minTotal = parseFloat(min.price) + calculateDeliveryFee(min.business.city);
    return pTotal < minTotal ? p : min;
  }, products[0] || { price: "9999", business: { city: "" } });
  const mostRated = products.reduce((max, p) => {
    const maxRating = parseFloat(max.business.rating || "0");
    const pRating = parseFloat(p.business.rating || "0");
    return pRating > maxRating ? p : max;
  }, products[0] || { business: { rating: "0" } });

  if (error) {
    return <div className="text-red-500 text-center py-4">Error loading categories. Please try again later.</div>;
  }

  const activeCategory = categories?.find((cat) => cat.name === activeTab);

  return (
    <>
      {/* Inject custom CSS */}
      <style>{modalStyles}</style>

      <section className="py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl md:text-2xl font-medium text-[#292d32] mb-3 md:mb-6">
              Explore Categories
            </h2>

            {mounted && !isLoading && categories && (
              <CategoryTabs
                categories={categories}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            )}

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

        <Modal
          title={
            <span className="text-lg md:text-xl font-bold text-[#292d32] block py-2 px-4 border-b">
              Products in {selectedCategory}
            </span>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          className="slide-in-left w-full max-w-md md:max-w-2xl rounded-r-lg shadow-xl" // Left slide and responsive width
          style={{ top: 0, height: "100vh" }} // Full height from top
          bodyStyle={{ padding: 0, height: "calc(100vh - 55px)", overflowY: "auto" }} // Adjust for title height
          maskClosable={true} // Close on mask click
          closable={true}
        >
          {productsLoading ? (
            <div className="text-center text-gray-500 py-4">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No products found for this category.</div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Filter Buttons */}
              <div className="flex flex-col md:flex-row justify-center gap-2 md:gap-4 mb-4">
                <button
                  onClick={() => setFilter("fastest")}
                  className={`w-full md:w-auto px-3 py-1.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                    filter === "fastest"
                      ? "bg-gradient-to-r from-[#FF6600] to-[#FF8C00] text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Fastest Delivery <span className="ml-1 text-xs">+10 Pts</span>
                </button>
                <button
                  onClick={() => setFilter("lowest")}
                  className={`w-full md:w-auto px-3 py-1.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                    filter === "lowest"
                      ? "bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => setFilter("rated")}
                  className={`w-full md:w-auto px-3 py-1.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                    filter === "rated"
                      ? "bg-gradient-to-r from-[#2196F3] to-[#42A5F5] text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Most Rated
                </button>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                {sortedProducts.map((product) => {
                  const deliveryFee = calculateDeliveryFee(product.business.city);
                  const price = parseFloat(product.price);
                  const totalCost = price + deliveryFee;
                  const businessId = getBusinessId(product.business.name);
                  const isFastest = filter === "fastest" && product === fastest;
                  const isLowest = filter === "lowest" && product === lowest;
                  const isMostRated = filter === "rated" && product === mostRated;

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="w-12 h-12 md:w-15 md:h-15 object-cover rounded-full border-2 border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-[#292d32] flex items-center gap-2 text-sm md:text-base">
                            {product.name}
                            {isFastest && (
                              <span className="text-xs text-white bg-[#FF6600] px-2 py-1 rounded-full">
                                Fastest
                              </span>
                            )}
                            {isLowest && (
                              <span className="text-xs text-white bg-[#4CAF50] px-2 py-1 rounded-full">
                                Cheapest
                              </span>
                            )}
                            {isMostRated && (
                              <span className="text-xs text-white bg-[#2196F3] px-2 py-1 rounded-full">
                                Top Rated
                              </span>
                            )}
                          </p>
                          <p className="text-xs md:text-sm text-gray-600">{product.business.name}</p>
                          <p className="text-xs md:text-sm text-gray-700">
                            ₦{price} + ₦{deliveryFee} Delivery ={" "}
                            <span className="font-medium">₦{totalCost}</span>
                          </p>
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs text-gray-500">
                            <span>Delivery: {product.business.deliveryTimeRange || "N/A"}</span>
                            {product.business.rating && (
                              <div className="flex items-center gap-1">
                                <Rate
                                  disabled
                                  value={
                                    isNaN(parseFloat(product.business.rating))
                                      ? 0
                                      : parseFloat(product.business.rating)
                                  }
                                  style={{ fontSize: 12, color: "#FF6600" }}
                                />
                                <span>({product.business.rating})</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link
                        href={businessId ? `/store/${businessId}` : "#"}
                        className={`mt-2 md:mt-0 flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 w-full md:w-auto ${
                          businessId
                            ? "bg-[#FF6600] text-white hover:bg-[#e65c00]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Order Now {filter === "fastest" && "(+10 Pts)"}
                      </Link>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Fastest Delivery Guarantee: Earn 20 bonus points if we’re late!
              </p>
            </div>
          )}
        </Modal>
      </section>
    </>
  );
}