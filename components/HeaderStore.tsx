// components/Header.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, ShoppingBag, User } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";

export default function Header() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // const mobileMenuItems = [
  //   {
  //     name: "Products",
  //     icon: <Home size={20} />,
  //     dropdown: ["BetaSpoon", "ShipazDay"],
  //     href: "/products",
  //   },
  //   {
  //     name: "Know Us",
  //     icon: <Info size={20} />,
  //     href: "/know-us",
  //   },
  //   {
  //     name: "FAQs",
  //     icon: <HelpCircle size={20} />,
  //     href: "/faqs",
  //   },
  //   {
  //     name: "Contact",
  //     icon: <Phone size={20} />,
  //     href: "/contact",
  //   },
  //   {
  //     name: "Become a vendor",
  //     icon: <Utensils size={20} />,
  //     href: "/become-a-vendor",
  //   },
  //   {
  //     name: "Become a Rider",
  //     icon: <User size={20} />,
  //     href: "/become-a-rider",
  //   },
  // ];

  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const openLoginModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Handle successful authentication (e.g., show toast, update UI, etc.)
    console.log("Authentication successful!");
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className=" p-2 rounded-lg">
                <Image
                  src="/betaday.png"
                  alt="Palapolo Logo"
                  width={20}
                  height={20}
                  className="filter brightness-0 invert"
                />
              </div>
            </Link>

            <div className="flex items-center text-gray-600 text-sm">
              <span className="flex items-center gap-1">
                <span className="font-bold hide-on-small">Delivery to:</span>
                <span className="font-medium flex items-center truncate-text">
                  56 Baale St, Olodi Apapa
                  <MapPin className="h-4 w-4 ml-1 hide-on-small" />
                </span>
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

            <button className="bg-[#1A2E20] hover:bg-[#210603] cursor-pointer text-white p-2 rounded relative">
              {/* <Image
              src="/icons/basket.png"
              alt="basket"
              width={10}
              height={10}
              className="h-5 w-5"
            /> */}
              <ShoppingBag className="h-5 w-5" />
              <CartBadge />
            </button>

            <button
              className="bg-[#1A2E20] hover:bg-[#210603] cursor-pointer text-white p-2 rounded relative"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <User className="h-5 w-5  " />
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
    </>
  );
}
