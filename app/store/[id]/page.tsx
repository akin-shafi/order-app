/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import { useCart } from "@/contexts/cart-context";
import { useAddress } from "@/contexts/address-context";
import Cart from "@/components/cart/cart";
import { Slider } from "antd";
import ItemModal from "@/components/modal/ItemModal"; // Import the new modal
import {
  restaurant,
  menuItemsByCategory,
  sampleCategories,
} from "@/data/content";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  popular?: boolean;
};

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { dispatch } = useCart();
  const { address, setAddress, setCoordinates } = useAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 10000]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); // State for the selected item

  // Convert price string to number for filtering
  const parsePrice = (price: string): number => {
    return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
  };

  // Filter menu items by category and price range
  const getMenuItems = (): MenuItem[] => {
    const items =
      activeCategory === "all"
        ? Object.values(menuItemsByCategory).flat()
        : menuItemsByCategory[activeCategory as keyof typeof menuItemsByCategory] || [];

    return items.filter((item) => {
      const itemPrice = parsePrice(item.price);
      return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    });
  };

  const getProgressBarPosition = () => {
    const index = sampleCategories.findIndex((cat) => cat.id === activeCategory);
    return `${(index / (sampleCategories.length - 1)) * 100}%`;
  };

  // Set fixed price range limits with flexibility
  const minPrice = 0;
  const maxPrice = 15000;

  return (
    <div className="min-h-screen bg-white">
      <HeaderStore />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Restaurant details and menu */}
          <div className="w-full lg:w-2/3">
            {/* Back navigation */}
            <Link
              href="/store"
              className="inline-flex items-center text-gray-600 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Business
            </Link>

            {/* Restaurant info */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
              <div className="col-span-1 lg:col-span-2">
                <Image
                  src={restaurant.image || "/images/food.png"}
                  alt={restaurant.name}
                  width={256}
                  height={256}
                  className="rounded-md object-cover w-full h-full"
                />
              </div>
              <div className="col-span-1 lg:col-span-4">
                <div className="flex flex-col items-start text-gray-500 text-sm mb-1">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {restaurant.deliveryTime}
                </div>

                <h1 className="text-2xl font-bold mb-1 text-[#292d32]">
                  {restaurant.name}
                </h1>

                <div className="flex items-center mb-2">
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-sm ml-1 text-[#292d32]">
                    {restaurant.rating}({restaurant.reviews})
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  Opening Time:{" "}
                  <span className="font-medium">{restaurant.openingTime}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8 text-[#292d32]">
              <h2 className="text-xl font-bold mb-4">Categories</h2>

              <div className="flex flex-col gap-4">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto pb-2 -mx-1 scrollbar-hide">
                  {sampleCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 mx-1 rounded-md text-sm whitespace-nowrap transition-colors duration-200 flex items-center justify-center
                        ${
                          activeCategory === category.id
                            ? "bg-[#1A2E20] text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      {category.name}
                      <span className="ml-1 text-xs opacity-60">
                        ({category.count})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Price Filter */}
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-md font-semibold mb-2 text-[#292d32]">
                    Filter by Price (Naira)
                  </h3>
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value as [number, number])}
                    tooltip={{ formatter: (value) => `₦${value}` }}
                    className="w-full"
                    trackStyle={[{ backgroundColor: "#1A2E20" }]}
                    handleStyle={[{ borderColor: "#FF6600", borderWidth: 2 }]}
                    railStyle={{ backgroundColor: "#e0e0e0" }}
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    Price Range: ₦{priceRange[0]} - ₦{priceRange[1]}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-1 bg-gray-200 rounded-full relative">
                <motion.div
                  className="absolute h-full bg-[#1A2E20] rounded-full"
                  initial={false}
                  animate={{
                    width: "20%",
                    left: getProgressBarPosition(),
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
            </div>

            {/* Menu items */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {getMenuItems().map((item) => (
                  <div
                    key={item.id}
                    className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer"
                    onClick={() => setSelectedItem(item)} // Open modal on click
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={item.image || "/images/food.png"}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="rounded-md object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.popular && (
                          <span className="absolute top-2 left-2 bg-[#ff6600] text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex-1 text-[#292d32]">
                        <h3 className="font-medium text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1A2E20]">
                            {item.price}
                          </span>
                          {/* Removed the direct add button */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column - Cart */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0 hidden md:block">
            <div className="sticky top-24">
              <Cart />
            </div>
          </div>
        </div>
      </main>
      <FooterStore />
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white">Fetching your location...</div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-red-500">{error}</div>
        </div>
      )}
      {/* Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            key="item-modal"
          />
        )}
      </AnimatePresence>
    </div>
  );
}