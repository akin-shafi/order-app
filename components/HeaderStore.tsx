/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useContext } from "react";
import Image from "next/image";
import { MapPin, Search, ShoppingCart, User } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";
import AddressSearchModal from "./modal/address-search-modal";
import { useCurrentLocation } from "@/utils/useCurrentLocation";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For potential redirection

// Assuming there's an AddressContext or similar to get initial address
interface AddressContextType {
  address?: string;
}
const AddressContext = React.createContext<AddressContextType>({});

export default function HeaderStore() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState(""); // State for desktop search
  const [mobileSearch, setMobileSearch] = useState(""); // State for mobile search

  const { address: contextAddress } = useContext(AddressContext);
  const { address, isLoading, error, debugInfo } = useCurrentLocation({
    initialAddress: contextAddress,
  });
  const router = useRouter(); // For navigation in handleSearch

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

  // Handle search for both desktop and mobile inputs
  const handleSearch = (query: string, source: "desktop" | "mobile") => {
    if (!query.trim()) {
      console.log(`${source} search: Empty query`);
      return;
    }
    console.log(`${source} search query:`, query);
    // Example: Redirect to a search results page
    // router.push(`/search?q=${encodeURIComponent(query)}`);
    // Reset the search input after submission (optional)
    if (source === "desktop") setDesktopSearch("");
    if (source === "mobile") setMobileSearch("");
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          {/* Top Row: Logo, Location, Desktop Search, Cart, User */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="block border object-contain rounded">
                <Image
                  src="/beta-icon.png"
                  alt="betaday logo"
                  width={55}
                  height={55}
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
                  >
                    <MapPin className="h-4 w-4 ml-1 hide-on-small text-[#FF6600] mr-2" />
                    {isLoading ? "Locating..." : address || "Set your location"}
                  </button>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop Search Input */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="What can we get you?"
                  value={desktopSearch}
                  onChange={(e) => setDesktopSearch(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSearch(desktopSearch, "desktop")
                  }
                  className="bg-[#f2f2f2] rounded py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2E20]"
                />
              </div>

              <button
                type="button"
                className="relative bg-[#1A2E20] hover:bg-[#1A2E20] cursor-pointer flex items-center text-[white] justify-center rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
                onClick={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("blip-effect");
                  setTimeout(
                    () => e.currentTarget.classList.remove("blip-effect"),
                    300
                  );
                }}
              >
                <ShoppingCart size={24} />
                <CartBadge />
              </button>

              <button
                type="button"
                className="relative bg-[#FF6600] hover:bg-gray-400 cursor-pointer flex items-center text-white justify-center rounded-full w-[40px] h-[40px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("User icon clicked, opening login modal");
                  setIsLoginModalOpen(true);
                }}
              >
                <User className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Search Input (Bottom) */}
          <div className="relative block md:hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search on mobile..."
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSearch(mobileSearch, "mobile")
              }
              className="w-full bg-[#f2f2f2] rounded py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2E20]"
            />
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

// Temporary placeholder for setError until implemented
function setError(_arg0: null) {
  console.warn("setError not implemented");
}
