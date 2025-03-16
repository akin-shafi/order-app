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
  businessType: string;
};

export default function StoreDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [categories, setCategories] = useState<string[]>([]);
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

        const categoryList = Object.keys(grouped);
        setCategories(categoryList);
        if (categoryList.length > 0) {
          setActiveCategory(categoryList[0]);
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

  const getCategoryCounts = () => {
    return Object.fromEntries(
      Object.entries(groupedProducts).map(([category, items]) => [
        category,
        items.length,
      ])
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              {/* Business Info Skeleton */}
              <div className="w-full mb-6">
                <div className="inline-flex items-center mb-6">
                  <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-200 rounded-md mb-6" />
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="flex items-baseline">
                      <div className="h-8 w-3/4 bg-gray-200 rounded mr-4" />
                      <div className="flex items-center">
                        <div className="h-4 w-8 bg-gray-200 rounded mr-2" />
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex w-full md:w-52 bg-gray-200 h-10 rounded-lg mt-4 md:mt-0" />
                  </div>
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>

              {/* Categories Skeleton */}
              <div className="flex gap-2 mb-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-8 w-20 bg-gray-200 rounded" />
                  ))}
              </div>

              {/* Menu Items Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-24 w-24 bg-gray-200 rounded-md" />
                      <div className="flex-1">
                        <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-full bg-gray-200 rounded mb-1" />
                        <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cart Skeleton */}
            <div className="w-full lg:w-1/3">
              <div className="border rounded-lg p-4">
                <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
                <div className="h-32 w-full bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>

        {/* Footer Skeleton */}
        <div className="border-t mt-6">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
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
              categoryCounts={getCategoryCounts()}
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
