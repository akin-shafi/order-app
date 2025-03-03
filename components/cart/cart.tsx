"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/contexts/cart-context";
import CartItem from "./cart-item";

export default function Cart() {
  const { state } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg p-6">
        <h2 className="text-xl text-[#292d32] dark:text-white font-bold text-center mb-4">
          Your cart is empty. Add items to get started
        </h2>

        <div className="flex justify-center mb-6">
          <Image
            src="/images/takeaway.png?height=150&width=200"
            alt="Empty cart"
            width={200}
            height={150}
            className="opacity-80"
          />
        </div>

        <p className="text-center text-gray-500 text-sm  dark:text-white">
          You&apos;ve not added any products yet. When you do, you&apos;ll see
          them here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      <div className="divide-y">
        <AnimatePresence>
          {state.items.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-lg">{state.total}</span>
        </div>

        <button className="w-full bg-[#1A2E20] text-white py-3 rounded-md hover:bg-[#5a2018] transition-colors">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
