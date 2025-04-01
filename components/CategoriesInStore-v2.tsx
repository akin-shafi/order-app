"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Modal, Input } from "antd"; // Added Input for price reporting
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/hooks/useProducts";
import { CategoryTabs } from "./CategoryTabs";
import { useAddress } from "@/contexts/address-context";
import { useBusiness } from "@/hooks/useBusiness";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string | null;
  isAvailable: boolean;
  business: {
    name: string;
    city: string;
    state: string;
  };
}

const SkeletonCategoryCard = () => (
  <div className="p-3 rounded-lg flex flex-col items-center animate-pulse bg-gray-100 w-32 h-28 flex-shrink-0">
    <div className="w-12 h-12 mb-2 bg-gray-200 rounded-full" />
    <div className="h-3 bg-gray-200 rounded w-20" />
  </div>
);

export default function CategoriesInStore() {
  const { data: categories, isLoading, error } = useCategories();
  const { locationDetails } = useAddress();
  const [activeTab, setActiveTab] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportedProduct, setReportedProduct] = useState<Product | null>(null);
  const [reportedPrice, setReportedPrice] = useState<string>("");

  const { businesses } = useBusiness({
    address: locationDetails?.address || "",
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
    ],
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

  // Find the best deal (lowest total cost)
  const getBestDeal = () => {
    if (!products.length) return null;
    return products.reduce((best, current) => {
      const currentTotal =
        parseFloat(current.price) + calculateDeliveryFee(current.business.city);
      const bestTotal =
        parseFloat(best.price) + calculateDeliveryFee(best.business.city);
      return currentTotal < bestTotal ? current : best;
    });
  };

  const bestDeal = getBestDeal();

  // Handle price report submission (placeholder for backend integration)
  const handlePriceReport = () => {
    if (!reportedProduct || !reportedPrice) return;
    const reportedTotal =
      parseFloat(reportedPrice) +
      calculateDeliveryFee(reportedProduct.business.city);
    const currentTotal =
      parseFloat(reportedProduct.price) +
      calculateDeliveryFee(reportedProduct.business.city);
    if (reportedTotal < currentTotal) {
      // Simulate applying the lower price (update this with actual backend call)
      console.log(
        `Price matched! New price for ${reportedProduct.name}: ₦${reportedPrice}`
      );
      // TODO: Call backend API to verify and apply discount
    }
    setIsReportModalOpen(false);
    setReportedPrice("");
    setReportedProduct(null);
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

      {/* Main Modal for Category Products */}
      <Modal
        title={`Products in ${selectedCategory} - Price Match Guarantee`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        {productsLoading ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
          <div>No products found for this category.</div>
        ) : (
          <div className="space-y-4">
            {bestDeal && (
              <div className="text-green-600 text-sm mb-2">
                Best Deal: ₦
                {parseFloat(bestDeal.price) +
                  calculateDeliveryFee(bestDeal.business.city)}{" "}
                at {bestDeal.business.name}
              </div>
            )}
            {products.map((product: Product) => {
              const deliveryFee = calculateDeliveryFee(product.business.city);
              const price = parseFloat(product.price);
              const totalCost = price + deliveryFee;
              const businessId = getBusinessId(product.business.name);
              const isBestDeal = bestDeal && bestDeal.id === product.id;
              return (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">
                        {product.name}{" "}
                        {isBestDeal && (
                          <span className="text-green-600 text-xs">
                            (Best Deal)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.business.name}
                      </p>
                      <p className="text-sm">
                        ₦{price} + ₦{deliveryFee} Delivery = ₦{totalCost} Total
                      </p>
                      <button
                        className="text-[#FF6600] text-xs underline mt-1"
                        onClick={() => {
                          setReportedProduct(product);
                          setIsReportModalOpen(true);
                        }}
                      >
                        Found it cheaper? Report it!
                      </button>
                    </div>
                  </div>
                  <Link
                    href={businessId ? `/store/${businessId}` : "#"}
                    className={`text-[#FF6600] ${
                      businessId
                        ? "hover:underline"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    Shop in this Store
                  </Link>
                </div>
              );
            })}
            <p className="text-xs text-gray-500 mt-2">
              Price Match Guarantee: We’ll match any lower price you find on our
              platform!
            </p>
          </div>
        )}
      </Modal>

      {/* Price Report Modal */}
      <Modal
        title={`Report a Lower Price for ${reportedProduct?.name}`}
        open={isReportModalOpen}
        onOk={handlePriceReport}
        onCancel={() => setIsReportModalOpen(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <p className="mb-2">
          Enter the lower price you found (excluding delivery):
        </p>
        <Input
          type="number"
          value={reportedPrice}
          onChange={(e) => setReportedPrice(e.target.value)}
          placeholder="e.g., 500"
          prefix="₦"
          className="mb-2"
        />
        <p className="text-sm text-gray-600">
          Current price: ₦
          {reportedProduct ? parseFloat(reportedProduct.price) : "N/A"}
        </p>
      </Modal>
    </section>
  );
}
