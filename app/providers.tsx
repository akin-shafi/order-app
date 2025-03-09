"use client";

import { ShoppingListProvider } from "@/contexts/shopping-list-context";
import { CartProvider } from "@/contexts/cart-context";
import CartModal from "@/components/cart/CartModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShoppingListProvider>
      <CartProvider>
        {children}
        <CartModal
          isOpen={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          restaurantName={""}
        />
      </CartProvider>
    </ShoppingListProvider>
  );
}
