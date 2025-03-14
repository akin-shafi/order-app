"use client";

import { AddressProvider } from "@/contexts/address-context";
import { CartProvider } from "@/contexts/cart-context";
import { ShoppingListProvider } from "@/contexts/shopping-list-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ModalProvider } from "@/contexts/modal-context";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ModalProvider>
        <AddressProvider>
          <ShoppingListProvider>
            <CartProvider>{children}</CartProvider>
          </ShoppingListProvider>
        </AddressProvider>
      </ModalProvider>
    </AuthProvider>
  );
}
