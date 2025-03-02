"use client";
import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  description: string;
}

interface CartState {
  items: CartItem[];
  total: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } };

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: calculateTotal([
            ...state.items.map((item) =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          ]),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: calculateTotal([
          ...state.items,
          { ...action.payload, quantity: 1 },
        ]),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity < 1) {
        const newItems = state.items.filter(
          (item) => item.id !== action.payload.id
        );
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        };
      }

      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      };
    }

    default:
      return state;
  }
}

function calculateTotal(items: CartItem[]): string {
  const total = items.reduce((sum, item) => {
    const price = Number.parseFloat(
      item.price.replace("₦", "").replace(",", "")
    );
    return sum + price * item.quantity;
  }, 0);

  return `₦${total.toLocaleString()}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: "₦0" });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
