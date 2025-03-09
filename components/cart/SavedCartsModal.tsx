"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useShoppingList } from "@/contexts/shopping-list-context";
import { useCart } from "@/contexts/cart-context";
import { useHeaderStore } from "@/stores/header-store";

interface SavedCart {
  packs: {
    id: string;
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
  }[];
  activePackId: string | null;
  includeBrownBag: boolean;
}

interface SavedCartsModalProps {
  onClose: () => void;
}

const SavedCartsModal: React.FC<SavedCartsModalProps> = ({ onClose }) => {
  useShoppingList();
  const { dispatch: cartDispatch } = useCart();
  useHeaderStore();
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedCarts");
    if (saved) {
      setSavedCarts(JSON.parse(saved));
    }
  }, []);

  const handleRestoreCart = (savedCart: SavedCart) => {
    cartDispatch({
      type: "RESTORE_CART",
      payload: savedCart,
    });
    onClose();
  };

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-xl z-10">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-[#292d32]">Saved Carts</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {savedCarts.map((savedCart) => (
          <div key={savedCart.activePackId} className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {savedCart.packs[0].items[0].name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(
                    savedCart.packs[0].items[0].name
                  ).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRestoreCart(savedCart)}
                className="text-[#ff6600] text-sm"
              >
                Restore Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedCartsModal;
