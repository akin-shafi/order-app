// store/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import ItemModal from "@/components/modal/Item-modal";
import BusinessInfoSection from "@/components/BusinessInfoSection";
import CategoriesSection from "@/components/store/CategoriesSection";
import MenuItemsSection from "@/components/store/MenuItemsSection";
import CartSection from "@/components/store/CartSection";
import FloatingCheckoutButton from "@/components/cart/FloatingCheckoutButton";
import CartModal from "@/components/cart/CartModal";
import { fetchBusinessById } from "@/services/useBusiness";
import { groupProductsByCategory } from "@/utils/groupProductsByCategory";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  popular?: boolean;
};

type BusinessDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  deliveryOptions: string[];
  image: string | null;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  rating: string;
  totalRatings: number;
  isActive: boolean;
  products: MenuItem[];
};

export default function StoreDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  // Get categories from groupedProducts once available
  const [categories, setCategories] = useState<string[]>([]);
  // Set first category as active by default instead of "all"
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 10000]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedProducts, setGroupedProducts] = useState<{
    [category: string]: MenuItem[];
  }>({});

  const parsePrice = (price: string): number => {
    return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
  };

  const getMenuItems = (): MenuItem[] => {
    const items =
      activeCategory === "all"
        ? Object.values(groupedProducts).flat()
        : groupedProducts[activeCategory] || [];
    return items.filter((item) => {
      const itemPrice = parsePrice(item.price);
      return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    });
  };

  const handleCheckout = () => {
    setIsCartOpen(true);
  };

  useEffect(() => {
    const getBusiness = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchBusinessById(id, "products");
        setBusiness(response.business);

        const grouped = groupProductsByCategory(response.business.products);
        setGroupedProducts(grouped);

        // Set categories and make first one active
        const categoryList = Object.keys(grouped);
        setCategories(categoryList);
        if (categoryList.length > 0) {
          setActiveCategory(categoryList[0]); // Set first category as active
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch business"
        );
        console.error("Error fetching business:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getBusiness();
    }
  }, [id]);

  // Function to get category item counts
  const getCategoryCounts = () => {
    return Object.fromEntries(
      Object.entries(groupedProducts).map(([category, items]) => [
        category,
        items.length,
      ])
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !business) {
    return <div>{error || "Business not found"}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderStore restaurantName={business.name} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <BusinessInfoSection business={business} isLoading={isLoading} />
            <CategoriesSection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
              categoryCounts={getCategoryCounts()} // Pass category counts
              isLoading={isLoading}
            />
            <MenuItemsSection
              activeCategory={activeCategory}
              menuItems={getMenuItems()}
              setSelectedItem={setSelectedItem}
              isLoading={isLoading}
            />
          </div>
          <CartSection restaurantName={business.name} />
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
        restaurantName={business.name}
      />

      <FloatingCheckoutButton onCheckout={handleCheckout} />
    </div>
  );
}
