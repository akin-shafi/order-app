/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Search, ShoppingCart, User } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";
import AddressSearchModal from "./modal/address-search-modal";
import JoinWaitlistModal from "./modal/join-waitlist-modal"; // Added import
import Link from "next/link";
import { useAddress } from "@/contexts/address-context";
import CartModal from "./cart/CartModal";

interface HeaderStoreProps {
  restaurantName?: string;
}

const HeaderStore: React.FC<HeaderStoreProps> = ({ restaurantName = "" }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false); // Added state
  const [undeliverableAddress, setUndeliverableAddress] = useState(""); // Added state

  // Get all necessary data from the address context
  const { 
    address: contextAddress, 
    isAddressValid,
    isLoading,
    error,
    addressSource
  } = useAddress();

  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const openLoginModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleAuthSuccess = () => {
    console.log("Authentication successful!");
  };

  const handleAddressClick = () => {
    setIsAddressModalOpen(true);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Function to render the address text
  const renderAddressText = () => {
    if (isLoading) {
      return "Getting your location...";
    }
    if (error) {
      return "Set your location";
    }
    if (isAddressValid && contextAddress) {
      const sourceIndicator = {
        localStorage: "🔵",
        currentLocation: "📍",
        manual: "✏️",
        none: "⚪",
      }[addressSource];
      return `${sourceIndicator} ${contextAddress}`;
    }
    return "Set your location";
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="bg-[#000000] rounded">
              <Image
                src="/images/betaday-logo.png"
                alt="betaday logo"
                width={40}
                height={40}
                className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] transition-all duration-300 object-contain"
                quality={55}
                priority
                sizes="(max-width: 640px) 16vw, (max-width: 768px) 20vw, (max-width: 1024px) 24vw, 28vw"
              />
            </Link>

            <div className="flex items-center text-gray-600">
              <span className="flex items-center ml-2 md:ml-5 mr-6">
                <button
                  type="button"
                  onClick={handleAddressClick}
                  className="flex font-medium text-sm md:text-sm w-fit items-center leading-none"
                  disabled={isLoading}
                >
                  <MapPin className="h-4 w-4 ml-1 hide-on-small text-[#FF6600] mr-2" />
                  <span className="truncate max-w-[150px] md:max-w-[200px]">
                    {renderAddressText()}
                  </span>
                </button>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="search"
                inputMode="search"
                placeholder="What can we get you?"
                className="bg-[#f2f2f2] rounded py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#000000]"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={toggleCart}
                className="relative bg-[#1A2E20] hover:bg-[#1A2E20] cursor-pointer flex items-center text-[white] justify-center rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              >
                <ShoppingCart size={20} />
                <CartBadge />
              </button>

              {isCartOpen && (
                <CartModal
                  isOpen={isCartOpen}
                  onClose={() => setIsCartOpen(false)}
                  restaurantName={restaurantName}
                />
              )}
            </div>

            <button
              type="button"
              className="relative bg-[#FF6600] hover:bg-gray-400 cursor-pointer flex items-center text-white justify-center rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              onClick={openLoginModal}
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onLogin={openLoginModal}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onCreateAccount={openSignupModal}
      />

      <AddressSearchModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onJoinWaitlist={(address: string) => {
          setUndeliverableAddress(address);
          setIsAddressModalOpen(false);
          setIsWaitlistModalOpen(true);
        }}
      />

      <JoinWaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => {
          setIsWaitlistModalOpen(false);
          setUndeliverableAddress("");
        }}
        address={undeliverableAddress}
      />
    </>
  );
};

export default HeaderStore;