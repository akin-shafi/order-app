/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// HeaderStore.tsx

import React, { useState, useContext } from "react";
import Image from "next/image";
import { MapPin, Search, User } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";
import { CartIcon } from "./icons";
import AddressSearchModal from "./modal/address-search-modal";
import { useCurrentLocation } from "@/utils/useCurrentLocation";
import Link from "next/link";

// Assuming there's an AddressContext or similar to get initial address
interface AddressContextType {
  address?: string;
}
const AddressContext = React.createContext<AddressContextType>({});

export default function HeaderStore() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Get initial address from context if available
  const { address: contextAddress } = useContext(AddressContext);

  const { address, isLoading, error, debugInfo } = useCurrentLocation({
    initialAddress: contextAddress,
  });

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
    if (error) {
      setError(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/beta-icon.png"
                alt="betaday logo"
                width={45}
                height={45}
                quality={45}
                priority
                className="object-contain rounded"
              />
            </Link>

            <div className="flex items-center text-gray-600 text-sm">
              <span className="flex items-center ml-2 md:ml-5 mr-6">
                <button
                  onClick={handleAddressClick}
                  className="flex text-xs w-fit items-center leading-none"
                >
                  <MapPin className="h-4 w-4 ml-1 hide-on-small text-[#FF6600] mr-2" />
                  {isLoading ? "Locating..." : address || "Set your location"}
                </button>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="What can we get you?"
                className="bg-[#f2f2f2] rounded py-2 pl-10 pr-4 w-64 text-sm bg-focus"
              />
            </div>

            <button
              className="relative bg-[#1A2E20] hover:bg-[#FF6600] cursor-pointer flex items-center text-white justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              onClick={(e) => {
                e.currentTarget.classList.add("blip-effect");
                setTimeout(
                  () => e.currentTarget.classList.remove("blip-effect"),
                  300
                );
              }}
            >
              <CartIcon className="h-4 w-4" />
              <CartBadge />
            </button>

            <button
              className="relative bg-[#FF6600] hover:bg-gray-400 cursor-pointer flex items-center text-white justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              onClick={(e) => {
                e.currentTarget.classList.add("blip-effect");
                setTimeout(
                  () => e.currentTarget.classList.remove("blip-effect"),
                  300
                );
                setIsLoginModalOpen(true);
              }}
            >
              <User className="h-4 w-4" />
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
      />

      {error && <div className="text-red-500 text-center">{error}</div>}
      {debugInfo && process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 text-center">{debugInfo}</div>
      )}
    </>
  );
}
function setError(arg0: null) {
  throw new Error("Function not implemented.");
}
