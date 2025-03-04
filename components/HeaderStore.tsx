/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, User } from "lucide-react";
import SignupModal from "./auth/signup-modal";
import LoginModal from "./auth/login-modal";
import CartBadge from "./cart/cart-badge";
import { CartIcon } from "./icons";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "./modal/address-search-modal";

export default function HeaderStore() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false); // Track if we've tried fetching
  const { address, setAddress, setCoordinates } = useAddress();

  useEffect(() => {
    // Only attempt fetch on initial load if we haven't tried yet
    if (!address && !isLoading && !hasAttemptedFetch) {
      fetchCurrentLocation();
    }
  }, [address, hasAttemptedFetch]); // Depend on hasAttemptedFetch to avoid re-triggering

  const fetchCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by your browser. Please set your location manually."
      );
      setIsLoading(false);
      setHasAttemptedFetch(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            const fetchedAddress = data.results[0].formatted_address;
            setAddress(fetchedAddress);
            setCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          } else {
            setError(
              "No address found for your location. Please set it manually."
            );
          }
          setIsLoading(false);
          setHasAttemptedFetch(true);
        } catch (err) {
          console.error("Geocoding API error:", err);
          setError(
            "Failed to fetch address. Please try again or set manually."
          );
          setIsLoading(false);
          setHasAttemptedFetch(true);
        }
      },
      (err) => {
        let errorMessage = "Unable to retrieve your location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable it or set manually.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable. Please check your settings.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage =
              "An error occurred. Please set your location manually.";
        }
        setError(errorMessage);
        setIsLoading(false);
        setHasAttemptedFetch(true);
      },
      {
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

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
    // If there's an error, clear it and allow manual setting without re-fetching
    if (error) {
      setError(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="cursor-pointer block rounded">
              <Image
                src="/beta-icon.png"
                alt="betaday logo"
                width={45} // Specify the actual width of your image
                height={45} // Specify the actual height of your image
                quality={45}
                priority // Optional: if this is above-the-fold content
                className="object-contain rounded"
              />
            </Link>

            <div className="flex items-center text-gray-600 text-sm">
              <span className="flex items-center ml-2 md:ml-5 mr-6">
                {/* <span className="font-bold hide-on-small">Delivery to:</span> */}
                <button
                  onClick={handleAddressClick}
                  className="flex text-xs w-fit items-center leading-none"
                >
                  <MapPin className="h-4 w-4 ml-1 hide-on-small text-[#FF6600] mr-2" />
                  {address || "Set your location"}
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
              className="relative bg-[#1A2E20] hover:bg-[#FF6600]  cursor-pointer flex items-center text-white justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              onClick={(e) => {
                e.currentTarget.classList.add("blip-effect");
                setTimeout(() => {
                  e.currentTarget.classList.remove("blip-effect");
                }, 300); // Match the duration of the animation
              }}
            >
              <CartIcon className="h-4 w-4" />
              <CartBadge />
            </button>

            <button
              className="relative bg-[#FF6600] hover:bg-gray-400  cursor-pointer flex items-center text-white justify-center rounded-full w-[30px] h-[30px] md:w-[45px] md:h-[45px] shadow-indigo-500/40"
              onClick={(e) => {
                e.currentTarget.classList.add("blip-effect");
                setTimeout(() => {
                  e.currentTarget.classList.remove("blip-effect");
                }, 300); // Match the duration of the animation
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

      {isLoading && (
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-white">Fetching your location...</div>
        // </div>
      )}
      {error && (
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-red-500 text-center">{error}</div>
        // </div>
      )}
    </>
  );
}
