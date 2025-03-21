/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { toast } from "react-toastify";
import { getAuthToken } from "@/utils/auth";

interface SavedCart {
  id: string;
  userId: string;
  vendorId: string;
  cart: {
    source: string;
    vendor_id: string;
    order_items: {
      item_id: string;
      quantity: number;
      type: string;
      pack_id: string;
    }[];
    bag_quantity: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SavedCartModalProps {
  onClose: () => void;
}

const SavedCartModal: React.FC<SavedCartModalProps> = ({ onClose }) => {
  const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);
  const [loading, setLoading] = useState(false);
  const token = getAuthToken();
  const { dispatch } = useCart();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchSavedCarts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/save-for-later`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch saved carts");
        }

        const data = await response.json();
        setSavedCarts(data.savedCarts || []);
      } catch (error: any) {
        console.error("Error fetching saved carts:", error);
        toast.error("Failed to load saved carts");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCarts();
  }, [token]);

  const handleRestoreCart = (
    savedCart: SavedCart,
    clearAfterRestore: boolean = false
  ) => {
    try {
      const { order_items, bag_quantity } = savedCart.cart;

      // Map order_items to the cart context's pack structure
      const packs = order_items.reduce((acc: any[], item) => {
        const existingPack = acc.find((p) => p.id === item.pack_id);
        if (existingPack) {
          existingPack.items.push({
            id: item.item_id,
            name: `Item ${item.item_id}`, // Placeholder, fetch actual name if needed
            price: 0, // Placeholder, fetch actual price if needed
            quantity: item.quantity,
          });
        } else {
          acc.push({
            id: item.pack_id,
            items: [
              {
                id: item.item_id,
                name: `Item ${item.item_id}`, // Placeholder
                price: 0, // Placeholder
                quantity: item.quantity,
              },
            ],
          });
        }
        return acc;
      }, []);

      // Clear current cart and restore new one
      dispatch({ type: "CLEAR_CART" });

      packs.forEach((pack: any) => {
        // Add pack (without payload since ADD_PACK doesn't accept one)
        dispatch({ type: "ADD_PACK" });
        const newPackId = `Pack: ${packs.indexOf(pack) + 1}`; // Match the reducer's generated ID

        // Add items to the newly created pack
        pack.items.forEach((item: any) => {
          dispatch({
            type: "ADD_ITEM_TO_PACK",
            payload: { packId: newPackId, item },
          });
        });
      });

      dispatch({ type: "SET_BROWN_BAG_QUANTITY", payload: bag_quantity });

      toast.success("Cart restored successfully!");

      if (clearAfterRestore) {
        handleDeleteSavedCart(savedCart.id);
      }

      onClose();
    } catch (error: any) {
      console.error("Error restoring cart:", error);
      toast.error("Failed to restore cart");
    }
  };

  const handleDeleteSavedCart = async (cartId: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/save-for-later/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete saved cart");
      }

      const updatedCarts = savedCarts.filter((cart) => cart.id !== cartId);
      setSavedCarts(updatedCarts);
      toast.success("Saved cart deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting saved cart:", error);
      toast.error("Failed to delete saved cart");
    }
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
          {loading ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : savedCarts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No saved carts found
            </p>
          ) : (
            <div className="space-y-4">
              {savedCarts.map((savedCart) => (
                <div
                  key={savedCart.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-[#292d32]">
                        Saved Cart #{savedCart.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(savedCart.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSavedCart(savedCart.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    {savedCart.cart.order_items.length} item(s)
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => handleRestoreCart(savedCart, false)}
                      className="text-[#ff6600] text-sm font-medium"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handleRestoreCart(savedCart, true)}
                      className="text-[#ff6600] text-sm font-medium"
                    >
                      Restore & Clear
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
