"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Pack {
  id: string;
  items: CartItem[];
}

export interface CartState {
  packs: Pack[];
  activePackId: string | null;
  includeBrownBag: boolean;
}

type CartAction =
  | { type: "ADD_PACK" }
  | { type: "REMOVE_PACK"; payload: string }
  | { type: "DUPLICATE_PACK"; payload: string }
  | { type: "ADD_ITEM_TO_PACK"; payload: { packId: string; item: CartItem } }
  | {
      type: "UPDATE_ITEM_QUANTITY";
      payload: { packId: string; itemId: string; quantity: number };
    }
  | { type: "SET_ACTIVE_PACK"; payload: string }
  | { type: "TOGGLE_BROWN_BAG" }
  | { type: "CLEAR_CART" };

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<CartAction>;
    }
  | undefined
>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_PACK":
      return {
        ...state,
        packs: [
          ...state.packs,
          { id: `Pack: ${state.packs.length + 1}`, items: [] },
        ],
        activePackId: `Pack: ${state.packs.length + 1}`,
      };

    case "REMOVE_PACK":
      return {
        ...state,
        packs: state.packs.filter((pack) => pack.id !== action.payload),
        activePackId: state.packs[0]?.id || null,
      };

    case "DUPLICATE_PACK": {
      const packToDuplicate = state.packs.find(
        (pack) => pack.id === action.payload
      );
      if (!packToDuplicate) return state;

      const newPack = {
        id: `Pack: ${state.packs.length + 1}`,
        items: [...packToDuplicate.items],
      };

      return {
        ...state,
        packs: [...state.packs, newPack],
        activePackId: newPack.id,
      };
    }

    case "ADD_ITEM_TO_PACK": {
      return {
        ...state,
        packs: state.packs.map((pack) =>
          pack.id === action.payload.packId
            ? { ...pack, items: [...pack.items, action.payload.item] }
            : pack
        ),
      };
    }

    case "UPDATE_ITEM_QUANTITY": {
      return {
        ...state,
        packs: state.packs
          .map((pack) => {
            if (pack.id === action.payload.packId) {
              // If quantity is being reduced to 0, remove the item
              if (action.payload.quantity < 1) {
                return {
                  ...pack,
                  items: pack.items.filter(
                    (item) => item.id !== action.payload.itemId
                  ),
                };
              }
              // Otherwise update the quantity
              return {
                ...pack,
                items: pack.items.map((item) =>
                  item.id === action.payload.itemId
                    ? { ...item, quantity: action.payload.quantity }
                    : item
                ),
              };
            }
            return pack;
          })
          .filter((pack) => pack.items.length > 0), // Optionally remove empty packs
      };
    }

    case "SET_ACTIVE_PACK":
      return {
        ...state,
        activePackId: action.payload,
      };

    case "TOGGLE_BROWN_BAG":
      return {
        ...state,
        includeBrownBag: !state.includeBrownBag,
      };

    case "CLEAR_CART":
      return {
        packs: [],
        activePackId: null,
        includeBrownBag: false,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    packs: [],
    activePackId: null,
    includeBrownBag: false,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Dispatch each pack from saved state
        parsedCart.packs.forEach((pack: Pack) => {
          dispatch({ type: "ADD_PACK" });
          pack.items.forEach((item: CartItem) => {
            dispatch({
              type: "ADD_ITEM_TO_PACK",
              payload: {
                packId: pack.id,
                item,
              },
            });
          });
        });
        // Restore other state
        if (parsedCart.includeBrownBag) {
          dispatch({ type: "TOGGLE_BROWN_BAG" });
        }
        if (parsedCart.activePackId) {
          dispatch({
            type: "SET_ACTIVE_PACK",
            payload: parsedCart.activePackId,
          });
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
