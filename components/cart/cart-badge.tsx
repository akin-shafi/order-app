"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/cart-context";

export default function CartBadge() {
  const { state } = useCart();

  // Calculate total items across all packs
  const itemCount = state.packs.reduce((sum, pack) => {
    return (
      sum + pack.items.reduce((packSum, item) => packSum + item.quantity, 0)
    );
  }, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-2 -right-2 bg-[#f15736] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
        >
          {itemCount}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
