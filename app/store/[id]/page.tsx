"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import { useCart } from "@/contexts/cart-context";
import Cart from "@/components/cart/cart";
import {
  restaurant,
  menuItemsByCategory,
  sampleCategories,
} from "@/data/content";

// Define the MenuItem type
type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  popular?: boolean; // Optional property
};

export default function RestaurantPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { dispatch } = useCart();

  // Get all menu items for "All" category or filter by selected category
  const getMenuItems = (): MenuItem[] => {
    if (activeCategory === "all") {
      return Object.values(menuItemsByCategory).flat();
    }
    return (
      menuItemsByCategory[activeCategory as keyof typeof menuItemsByCategory] ||
      []
    );
  };

  // Calculate the progress bar position based on the active category
  const getProgressBarPosition = () => {
    const index = sampleCategories.findIndex(
      (cat) => cat.id === activeCategory
    );
    return `${(index / (sampleCategories.length - 1)) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderStore />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Restaurant details and menu */}
          <div className="w-full md:w-2/3">
            {/* Back navigation */}
            <Link
              href="/store"
              className="inline-flex items-center text-gray-600 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Restaurant
            </Link>

            {/* Restaurant info */}
            <div className="flex items-start gap-4 mb-8">
              <Image
                src={restaurant.image || "/images/food.png"}
                alt={restaurant.name}
                width={180}
                height={120}
                className="rounded-md object-cover"
              />

              <div>
                <div className="flex items-center text-gray-500 text-sm mb-1">
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
                    ></path>
                  </svg>
                  {restaurant.deliveryTime}
                </div>

                <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>

                <div className="flex items-center mb-2">
                  <svg
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-sm ml-1">
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
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Categories</h2>

              <div className="flex overflow-x-auto pb-2 -mx-1">
                {sampleCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 mx-1 rounded-md text-sm whitespace-nowrap transition-colors relative
                      ${
                        category.id === activeCategory
                          ? "bg-[#461914] text-white"
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

              <div className="mt-2 h-1 bg-gray-200 rounded-full relative">
                <motion.div
                  className="absolute h-full bg-[#461914] rounded-full"
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
                  <div key={item.id} className="flex items-start gap-3 group">
                    <div className="relative">
                      <Image
                        src={item.image || "/images/food.png"}
                        alt={item.name}
                        width={120}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      {item.popular && (
                        <span className="absolute top-2 left-2 bg-[#f15736] text-white text-xs px-2 py-1 rounded">
                          Popular
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{item.price}</span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "ADD_ITEM",
                              payload: {
                                id: item.id,
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                image: item.image || "/images/food.png",
                              },
                            })
                          }
                          className="p-1.5 rounded-md bg-white text-[#461914] border border-[#461914] hover:bg-[#461914] hover:text-white transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right column - Cart */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <div className="sticky top-24">
              <Cart />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterStore />
    </div>
  );
}
