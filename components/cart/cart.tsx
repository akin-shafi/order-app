"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/cart-context";
import Image from "next/image";
import Pack from "./Pack";
import { formatPrice } from "@/lib/utils";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "@/components/modal/address-search-modal";
import JoinWaitlistModal from "@/components/modal/join-waitlist-modal";
import { useAuth } from "@/contexts/auth-context";
import LoginModal from "@/components/auth/login-modal";
import PaymentOptionsModal from "@/components/modal/payment-options-modal";
import OnlinePaymentOptionsModal from "@/components/modal/online-payment-options-modal";
import { toast } from "react-toastify";

interface CartProps {
  restaurantName: string;
}

const Cart: React.FC<CartProps> = ({ restaurantName }) => {
  const { state, dispatch } = useCart();
  const {
    address: contextAddress,
    isAddressValid,
    isLoading,
    error,
    setAddress,
  } = useAddress();
  const { isAuthenticated } = useAuth();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [undeliverableAddress, setUndeliverableAddress] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isOnlinePaymentModalOpen, setIsOnlinePaymentModalOpen] =
    useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [displayedPaymentMethod, setDisplayedPaymentMethod] =
    useState<string>("Choose");
  const [deliveryInstructions, setDeliveryInstructions] = useState<string[]>(
    []
  );
  const [vendorInstructions, setVendorInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingForLater, setIsSavingForLater] = useState(false);
  const [showDeliveryTextarea, setShowDeliveryTextarea] = useState<boolean[]>(
    []
  );
  const [showVendorTextarea, setShowVendorTextarea] = useState(false);

  // Error states for inline messages
  const [cartError, setCartError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [paymentMethodError, setPaymentMethodError] = useState<string | null>(
    null
  );

  // Refs for scrolling to fields
  const cartRef = useRef<HTMLDivElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const paymentMethodRef = useRef<HTMLDivElement>(null);

  // Update address when changed via modal
  useEffect(() => {
    const handleAddressChange = (event: CustomEvent) => {
      const { address, coordinates, locationDetails } = event.detail;
      setAddress(address, {
        coordinates,
        locationDetails,
        source: "manual",
      });
      setAddressError(null); // Clear address error when address is updated
    };

    document.addEventListener(
      "addressChanged",
      handleAddressChange as EventListener
    );
    return () => {
      document.removeEventListener(
        "addressChanged",
        handleAddressChange as EventListener
      );
    };
  }, [setAddress]);

  const renderAddressText = () => {
    if (isLoading) {
      return "Getting your location...";
    }
    if (error) {
      return "Set your location";
    }
    if (isAddressValid && contextAddress) {
      return <>{contextAddress}</>;
    }
    return "Set your location";
  };

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

  const handleJoinWaitlist = (address: string) => {
    setUndeliverableAddress(address);
    setIsAddressModalOpen(false);
    setTimeout(() => {
      setIsWaitlistModalOpen(true);
    }, 100);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
    setUndeliverableAddress("");
  };

  const handlePaymentChoose = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setPaymentMethodError(null); // Clear error when a method is selected
  };

  const handleChooseMethod = () => {
    if (selectedPaymentMethod === "Pay Online") {
      setIsPaymentModalOpen(false);
      setIsOnlinePaymentModalOpen(true);
    } else {
      setDisplayedPaymentMethod(selectedPaymentMethod || "Choose");
      setIsPaymentModalOpen(false);
      setPaymentMethodError(null); // Clear error when a method is chosen
    }
  };

  const handleGoBack = () => {
    setIsOnlinePaymentModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleOnlinePaymentChoose = (method: string) => {
    setDisplayedPaymentMethod(method);
    setIsOnlinePaymentModalOpen(false);
    setPaymentMethodError(null); // Clear error when an online method is chosen
  };

  // Delivery Instructions Handlers
  const handleAddDeliveryInstruction = () => {
    setShowDeliveryTextarea([...showDeliveryTextarea, true]);
    setDeliveryInstructions([...deliveryInstructions, ""]);
  };

  const handleRemoveDeliveryInstruction = (index: number) => {
    const updatedTextareas = showDeliveryTextarea.filter((_, i) => i !== index);
    const updatedInstructions = deliveryInstructions.filter(
      (_, i) => i !== index
    );
    setShowDeliveryTextarea(updatedTextareas);
    setDeliveryInstructions(updatedInstructions);
  };

  const handleDeliveryInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...deliveryInstructions];
    updatedInstructions[index] = value;
    setDeliveryInstructions(updatedInstructions);
  };

  // Vendor Instructions Handlers
  const handleAddVendorInstruction = () => {
    setShowVendorTextarea(true);
    setVendorInstructions("");
  };

  const handleRemoveVendorInstruction = () => {
    setShowVendorTextarea(false);
    setVendorInstructions("");
  };

  const handleVendorInstructionChange = (value: string) => {
    setVendorInstructions(value);
  };

  const handlePlaceOrder = async () => {
    // Reset all errors
    setCartError(null);
    setAddressError(null);
    setPaymentMethodError(null);

    // Validation: Check if cart is empty
    if (state.packs.length === 0) {
      setCartError("Cart cannot be empty. Please add items to your cart.");
      toast.error("Cart cannot be empty. Please add items to your cart.");
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Validation: Check if user is authenticated
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      toast.error("Please log in to place an order.");
      return;
    }

    // Validation: Check if delivery address is set
    if (!contextAddress || !isAddressValid) {
      setAddressError("Please set a valid delivery address.");
      toast.error("Please set a valid delivery address.");
      if (addressRef.current) {
        addressRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // Validation: Check if payment method is selected
    if (!displayedPaymentMethod || displayedPaymentMethod === "Choose") {
      setPaymentMethodError("Please select a payment method.");
      toast.error("Please select a payment method.");
      if (paymentMethodRef.current) {
        paymentMethodRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);

    const payload = {
      deliveryAddress: contextAddress,
      paymentMethod: displayedPaymentMethod,
      deliveryInstructions, // Optional: Array of instructions
      vendorInstructions, // Optional: Single string
      cart: {
        packs: state.packs,
        includeBrownBag: state.includeBrownBag,
        total: calculateTotal(),
      },
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const data = await response.json();
      console.log("Order placed successfully:", data);
      dispatch({ type: "CLEAR_CART" });
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveForLater = async () => {
    // Reset cart error
    setCartError(null);

    // Validation: Check if cart is empty
    if (state.packs.length === 0) {
      setCartError("Cart cannot be empty. Please add items to your cart.");
      toast.error("Cart cannot be empty. Please add items to your cart.");
      if (cartRef.current) {
        cartRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      toast.error("Please log in to save your cart.");
      return;
    }

    setIsSavingForLater(true);

    const payload = {
      cart: {
        packs: state.packs,
        includeBrownBag: state.includeBrownBag,
        total: calculateTotal(),
      },
    };

    try {
      const response = await fetch("/api/save-for-later", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save for later");
      }

      const data = await response.json();
      console.log("Cart saved for later:", data);
      toast.success("Cart saved for later successfully!");
    } catch (error) {
      console.error("Error saving for later:", error);
      toast.error("Failed to save for later. Please try again.");
    } finally {
      setIsSavingForLater(false);
    }
  };

  if (state.packs.length === 0) {
    return (
      <div
        ref={cartRef}
        className="bg-white border-gray-100 rounded-lg p-6 mt-24"
      >
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
        {cartError && (
          <p className="text-red-500 text-sm text-center mt-2 animate-flash">
            {cartError}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-6rem)] bg-white rounded-lg border border-gray-200 flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 bg-white z-10">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-[#292d32]">
                {restaurantName}
              </h3>
              <button
                onClick={() => dispatch({ type: "ADD_PACK" })}
                className="text-[#ff6600] cursor-pointer border border-gray-200 text-xxs py-1 px-2 rounded-full flex items-center transition duration-300 hover:border-[#ff6600] hover:text-[#ff6600]"
              >
                + Add another pack
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
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
                    Need a brown bag?
                  </p>
                  <p className="text-xs text-gray-500">
                    Package your order in a brown bag for just ₦200.00
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={state.includeBrownBag}
                  onChange={() => dispatch({ type: "TOGGLE_BROWN_BAG" })}
                  className="rounded-full accent-[#ff6600]"
                />
              </div>
            </div>

            {/* Delivery Details */}
            <div className="space-y-4 py-4 font-medium text-xs">
              <div ref={paymentMethodRef} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32] truncate-text max-w-[70%]">
                    Payment Method: {displayedPaymentMethod}
                  </span>
                  <button
                    onClick={handlePaymentChoose}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline"
                  >
                    Choose
                  </button>
                </div>
                {paymentMethodError && (
                  <p className="text-red-500 text-xs animate-flash">
                    {paymentMethodError}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#292d32]">Promo Code</span>
                <button className="text-[#ff6600] text-sm cursor-pointer hover:underline">
                  Choose
                </button>
              </div>
              <div ref={addressRef} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32] truncate-text max-w-[70%]">
                    {renderAddressText()}
                  </span>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline"
                  >
                    Change
                  </button>
                </div>
                {addressError && (
                  <p className="text-red-500 text-xs animate-flash">
                    {addressError}
                  </p>
                )}
              </div>

              {/* Delivery Instructions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32]">
                    Delivery Instructions
                  </span>
                  <button
                    onClick={handleAddDeliveryInstruction}
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline"
                  >
                    {showDeliveryTextarea.length > 0 ? "Add Another" : "Add"}
                  </button>
                </div>
                {showDeliveryTextarea.map(
                  (show, index) =>
                    show && (
                      <div key={index} className="flex items-center gap-2">
                        <textarea
                          value={deliveryInstructions[index] || ""}
                          onChange={(e) =>
                            handleDeliveryInstructionChange(
                              index,
                              e.target.value
                            )
                          }
                          placeholder="e.g., drop at the reception"
                          className="w-full p-2 text-sm text-gray-700 bg-[#f8f9fa] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6600] resize-none"
                          rows={2}
                        />
                        <button
                          onClick={() => handleRemoveDeliveryInstruction(index)}
                          className="text-[#ff6600] text-sm cursor-pointer hover:underline flex items-center gap-1"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    )
                )}
              </div>

              {/* Vendor Instructions */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#292d32]">
                    Vendor Instructions
                  </span>
                  <button
                    onClick={
                      showVendorTextarea
                        ? handleRemoveVendorInstruction
                        : handleAddVendorInstruction
                    }
                    className="text-[#ff6600] text-sm cursor-pointer hover:underline flex items-center gap-1"
                  >
                    {showVendorTextarea ? (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Remove
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
                {showVendorTextarea && (
                  <textarea
                    value={vendorInstructions}
                    onChange={(e) =>
                      handleVendorInstructionChange(e.target.value)
                    }
                    placeholder="e.g., please add extra pepper"
                    className="w-full p-2 text-sm text-gray-700 bg-[#f8f9fa] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6600] resize-none"
                    rows={2}
                  />
                )}
              </div>
            </div>

            {/* PIN Confirmation Notice */}
            <div className="bg-[#fff5e6] p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#ff6600]">ℹ</span>
                <div>
                  <p className="text-sm font-medium text-[#292d32]">
                    Delivery includes PIN confirmation
                  </p>
                  <p className="text-xs text-gray-600">
                    This ensures your order reaches the right person
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
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-[#ff6600] text-white py-3 rounded-md font-medium transition-colors duration-200 hover:bg-[#e65c00] hover:shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
              <button
                onClick={() => dispatch({ type: "CLEAR_CART" })}
                className="w-full cursor-pointer bg-red-50 text-red-500 py-3 rounded-md font-medium transition-colors duration-200 hover:bg-red-100 hover:text-red-600"
              >
                Clear Orders
              </button>
              <button
                onClick={handleSaveForLater}
                disabled={isSavingForLater}
                className="w-full cursor-pointer bg-[#fff5e6] text-[#292d32] py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-[#ffe6cc] hover:text-[#ff6600] disabled:opacity-50"
              >
                <span className="text-[#ff6600] group-hover:text-[#e65c00]">
                  ♡
                </span>
                {isSavingForLater ? "Saving..." : "Save for Later"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Search Modal */}
      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onJoinWaitlist={handleJoinWaitlist}
      />

      {/* Waitlist Modal */}
      <JoinWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={closeWaitlistModal}
        address={undeliverableAddress}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Payment Options Modal */}
      <PaymentOptionsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectMethod={handlePaymentMethodSelect}
        selectedMethod={selectedPaymentMethod}
        onChooseMethod={handleChooseMethod}
      />

      {/* Online Payment Options Modal */}
      <OnlinePaymentOptionsModal
        isOpen={isOnlinePaymentModalOpen}
        onClose={() => setIsOnlinePaymentModalOpen(false)}
        onGoBack={handleGoBack}
        onChooseMethod={handleOnlinePaymentChoose}
      />
    </>
  );
};

export default Cart;
