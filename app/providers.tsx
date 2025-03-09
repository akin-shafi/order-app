"use client";

import { ShoppingListProvider } from "@/contexts/shopping-list-context";
import { CartProvider } from "@/contexts/cart-context";
import CartModal from "@/components/cart/CartModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ShoppingListProvider>
      <CartProvider>
        {children}
        <CartModal />
      </CartProvider>
    </ShoppingListProvider>
  );
}
