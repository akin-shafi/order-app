"use client";

import React from "react";
import { useCart } from "@/contexts/cart-context";
// import { X } from "lucide-react";
import Image from "next/image";
import Pack from "./Pack";
import { formatPrice } from "@/lib/utils";

interface CartProps {
  restaurantName: string;
}

const Cart: React.FC<CartProps> = ({ restaurantName }) => {
  const { state, dispatch } = useCart();

  const calculateTotal = () => {
    const packsTotal = state.packs.reduce((sum, pack) => {
      return (
        sum +
        pack.items.reduce(
          (packSum, item) => packSum + item.price * item.quantity,
          0
        )
      );
    }, 0);

    return state.includeBrownBag ? packsTotal + 200 : packsTotal;
  };

  if (state.packs.length === 0) {
    return (
      <div className="bg-white  border-gray-100 rounded-lg p-6 mt-24">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/takeaway.png"
            alt="Empty cart"
            width={200}
            height={150}
            className="opacity-80"
          />
        </div>
        <h2 className="text-xl text-[#292d32] font-bold text-center mb-4">
          Your cart has no items yet. <br /> Start by adding some!
        </h2>
        {/* <p className="text-center text-gray-500 text-sm">
          You&apos;ve not added any products yet. When you do, you&apos;ll see
          them here!
        </p> */}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] bg-white rounded-lg border border-gray-200 flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 ">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200 hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#292d32]">Checkout</h2>
            <div className="flex items-center gap-2">
              <span className="text-[#ff6600]">
                Cart (
                {state.packs.reduce((sum, pack) => sum + pack.items.length, 0)})
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant Name */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-[#292d32]">
              {restaurantName}
            </h3>
            <button
              onClick={() => dispatch({ type: "ADD_PACK" })}
              className="text-[#ff6600]  cursor-pointer border border-gray-200 text-xxs py-1 px-2 rounded-full flex items-center transition duration-300 hover:border-[#ff6600] hover:text-[#ff6600]"
            >
              + Add another pack
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container - includes everything else */}
      <div className="flex-1 overflow-y-auto">
        {/* Packs */}
        <div className="p-4 space-y-4">
          {state.packs.map((pack) => (
            <Pack
              key={pack.id}
              packId={pack.id}
              items={pack.items}
              isActive={pack.id === state.activePackId}
              onAddToThisPack={() =>
                dispatch({ type: "SET_ACTIVE_PACK", payload: pack.id })
              }
              onDuplicate={() =>
                dispatch({ type: "DUPLICATE_PACK", payload: pack.id })
              }
              onRemove={() =>
                dispatch({ type: "REMOVE_PACK", payload: pack.id })
              }
              onUpdateQuantity={(itemId, quantity) =>
                dispatch({
                  type: "UPDATE_ITEM_QUANTITY",
                  payload: { packId: pack.id, itemId, quantity },
                })
              }
            />
          ))}

          {/* Brown Bag Option */}
          <div className="py-3 border-t border-b border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <Image
                src="/icons/paper-bag.svg"
                alt="Brown bag"
                width={24}
                height={24}
              />
              <div>
                <p className="text-sm font-medium text-[#292d32]">
                  Need a BetaDay brown bag?
                </p>
                <p className="text-xs text-gray-500">
                  Package your order in a brown bag for just ₦200.00
                </p>
              </div>
              <input
                type="checkbox"
                checked={state.includeBrownBag}
                onChange={() => dispatch({ type: "TOGGLE_BROWN_BAG" })}
                className="rounded-full accent-[#000000]"
              />
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4 py-4 font-medium text-xs">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32]">Payment Method</span>
              <button className="text-[#ff6600] text-sm">Choose</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32]">Promo Code</span>
              <button className="text-[#ff6600] text-sm">Choose</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32]">Akere Bus Stop</span>
              <button className="text-[#ff6600] text-sm">Change</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32]">Choose Time</span>
              <button className="text-[#ff6600] text-sm">Edit</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32]">
                Delivery instructions
              </span>
              <button className="text-[#ff6600] text-sm">Add</button>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#292d32]">
                Vendor instructions
              </span>
              <button className="text-[#ff6600] text-sm">Add</button>
            </div>
          </div>

          {/* PIN Confirmation Notice */}
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#000000]">ℹ</span>
              <div>
                <p className="text-sm font-medium text-[#292d32]">
                  Delivery includes PIN confirmation
                </p>
                <p className="text-xs text-gray-600">
                  This helps ensure that your order is given to the right person
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2 py-4 border-t">
            <div className="flex justify-between text-sm text-[#292d32]">
              <span>Subtotal ({state.packs.length} item)</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <div className="flex justify-between text-sm text-[#292d32]">
              <span>Delivery fee</span>
              <span>₦0.00</span>
            </div>
            <div className="flex justify-between text-sm text-[#292d32]">
              <span>Service fee</span>
              <span>₦0.00</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t text-[#292d32]">
              <span>Total</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
      </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button className="w-full cursor-pointer bg-[#000000] text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#2A4A34] hover:shadow-md">
              Place order
            </button>
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="w-full cursor-pointer bg-red-50 text-red-500 py-3 rounded-md font-medium transition-colors duration-200 hover:bg-red-100 hover:text-red-600"
            >
              Clear orders
            </button>
            <button className="w-full cursor-pointer bg-gray-50 text-[#292d32] py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-gray-100 hover:text-[#ff6600]">
              <span className="text-[#ff6600] group-hover:text-[#ff8833]">
                ♡
              </span>{" "}
              Save for later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
