/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import { useHeaderStore } from "@/stores/header-store";
import Cart from "./cart";
import SavedCartsModal from "./SavedCartsModal";
import { useShoppingList } from "@/contexts/shopping-list-context";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
}) => {
  const { isCartOpen, isShoppingListOpen, setCartOpen, toggleShoppingList } =
    useHeaderStore();
  const { state: shoppingListState } = useShoppingList();

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Handle clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Animation variants for sliding in from the right
  const modalVariants = {
    hidden: {
      x: "100%", // Start off-screen to the right
      opacity: 0,
    },
    visible: {
      x: 0, // Slide to the visible position
      opacity: 1,
      transition: {
        type: "spring", // Smooth spring animation
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%", // Slide back out to the right
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full md:w-[480px] bg-white h-full animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-[#292d32]">Checkout</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShoppingList}
              className="flex items-center gap-1 text-[#ff6600]"
            >
              Saved Items:{" "}
              <span className="bg-[#ff6600] text-white rounded-full px-2 py-0.5 text-xs">
                {shoppingListState.savedCarts.length}
              </span>
            </button>
            <button
              className="cursor-pointer rounded-full  p-2 border border-gray-500 hover:text-white hover:bg-[#292d32]"
              onClick={() => {
                setCartOpen(false);
                onClose();
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <Cart restaurantName={restaurantName} />
        {/* Shopping List Modal */}
        {isShoppingListOpen && <SavedCartsModal onClose={toggleShoppingList} />}
      </div>
    </div>
  );
};

export default CartModal;
