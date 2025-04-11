"use client";

import type { ReactNode } from "react";
import { AddressProvider } from "@/contexts/address-context";
import { CartProvider } from "@/contexts/cart-context";
import { ShoppingListProvider } from "@/contexts/shopping-list-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ModalProvider } from "@/contexts/modal-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default stale time
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection time
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalProvider>
          <AddressProvider>
            <ShoppingListProvider>
              <CartProvider>{children}</CartProvider>
            </ShoppingListProvider>
          </AddressProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}