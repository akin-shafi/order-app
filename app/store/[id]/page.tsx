"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import ItemModal from "@/components/modal/ItemModal";
import BusinessInfoSection from "@/components/BusinessInfoSection";
import CategoriesSection from "@/components/store/CategoriesSection";
import MenuItemsSection from "@/components/store/MenuItemsSection";
import CartSection from "@/components/store/CartSection";
import FloatingCheckoutButton from "@/components/cart/FloatingCheckoutButton";
import CartModal from "@/components/cart/CartModal";
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

export default function StoreDetailsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 10000]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const parsePrice = (price: string): number => {
    return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
  };

  const getMenuItems = (): MenuItem[] => {
    const items =
      activeCategory === "all"
        ? Object.values(menuItemsByCategory).flat()
        : menuItemsByCategory[
            activeCategory as keyof typeof menuItemsByCategory
          ] || [];
    return items.filter((item) => {
      const itemPrice = parsePrice(item.price);
      return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderStore restaurantName={restaurant.name} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <BusinessInfoSection restaurant={restaurant} />
            <CategoriesSection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={sampleCategories}
            />
            <MenuItemsSection
              activeCategory={activeCategory}
              menuItems={getMenuItems()}
              setSelectedItem={setSelectedItem}
            />
          </div>
          <CartSection restaurantName={restaurant.name} />
        </div>
      </main>
      <FooterStore />

      {/* Modals */}
      <AnimatePresence>
        {selectedItem && (
          <ItemModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            key="item-modal"
          />
        )}
      </AnimatePresence>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurantName={restaurant.name}
      />

      {/* Floating Checkout Button */}
      <FloatingCheckoutButton onCheckout={handleCheckout} />
    </div>
  );
}
