/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
// import { formatPrice } from "@/lib/utils";

interface SavedCart {
  restaurantName: string;
  date: string;
  cart: any; // You can type this properly based on your cart state type
}

interface SavedCartModalProps {
  onClose: () => void;
}

const SavedCartModal: React.FC<SavedCartModalProps> = ({ onClose }) => {
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedCarts") || "[]");
    setSavedCarts(saved);
  }, []);

  const handleRestoreCart = (cart: SavedCart) => {
    // Implement restore functionality
    // This would typically dispatch actions to restore the cart state
    console.log("Restoring cart:", cart);
  };

  const handleDeleteSavedCart = (index: number) => {
    const updatedCarts = savedCarts.filter((_, i) => i !== index);
    localStorage.setItem("savedCarts", JSON.stringify(updatedCarts));
    setSavedCarts(updatedCarts);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#292d32]">Saved Carts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {savedCarts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No saved carts found
            </p>
          ) : (
            <div className="space-y-4">
              {savedCarts.map((savedCart, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#292d32]">
                        {savedCart.restaurantName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(savedCart.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSavedCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    {savedCart.cart.packs.length} pack(s)
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleRestoreCart(savedCart)}
                      className="text-[#ff6600] text-sm font-medium"
                    >
                      Restore Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedCartModal;
