"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, User } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";
import { CartIcon } from "./icons";
import { useAddress } from "@/contexts/address-context"; // Import address context
import AddressSearchModal from "./modal/address-search-modal"; // Add modal

export default function HeaderStore() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { address } = useAddress(); // Fetch address from context directly

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

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#F5F5F5] hover:bg-[#f15736] cursor-pointer p-2 rounded-full">
              <Link href="/" className="flex items-center">
                <Image
                  src="/betaday.png"
                  alt="BetaDay Logo"
                  width={90}
                  height={90}
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-bold hide-on-small">Delivery to:</span>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="font-bold flex items-center truncate-text hover:text-[#f15736]"
                >
                  {address || "Set your location"}
                  <MapPin className="h-4 w-4 ml-1 hide-on-small" />
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
                className="bg-gray-50 rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none"
              />
            </div>

            <button className="bg-[#f15736] hover:bg-[#210603] cursor-pointer text-white p-2 rounded relative">
              <CartIcon className="h-4 w-4" />
              <CartBadge />
            </button>

            <button
              className="bg-gray-200 hover:bg-[#210603] hover:text-white cursor-pointer text-dark p-2 rounded relative"
              onClick={() => setIsLoginModalOpen(true)}
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
    </>
  );
}
