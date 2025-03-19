/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full md:w-[480px] bg-white h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={() => {
                    setCartOpen(false);
                    onClose();
                  }}
                  aria-label="Close modal"
                >
                  <X
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              </div>
            </div>

            {/* Cart Content */}
            <Cart restaurantName={restaurantName} />
            {/* Shopping List Modal */}
            {isShoppingListOpen && (
              <SavedCartsModal onClose={toggleShoppingList} />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
