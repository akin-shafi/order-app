import React from "react";
import { X } from "lucide-react";
import { useShoppingList } from "@/contexts/shopping-list-context";
import { useCart } from "@/contexts/cart-context";
import { useHeaderStore } from "@/stores/header-store";

const SavedCartsModal: React.FC = () => {
  const { state, dispatch: shoppingListDispatch } = useShoppingList();
  const { dispatch: cartDispatch } = useCart();
  const { setShoppingListOpen } = useHeaderStore();

  const handleRestoreCart = (cartId: string) => {
    const savedCart = state.savedCarts.find((cart) => cart.id === cartId);
    if (savedCart) {
      // Restore cart items
      cartDispatch({ type: "RESTORE_CART", payload: savedCart.items });
      // Remove from shopping list
      shoppingListDispatch({ type: "RESTORE_CART", payload: cartId });
      // Close shopping list modal
      setShoppingListOpen(false);
    }
  };

  return (
    <div className="absolute inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-xl z-10">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-[#292d32]">Saved Carts</h2>
        <button onClick={() => setShoppingListOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-5rem)]">
        {state.savedCarts.map((savedCart) => (
          <div key={savedCart.id} className="p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{savedCart.restaurantName}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(savedCart.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRestoreCart(savedCart.id)}
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
