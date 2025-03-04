/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import FeaturedStore from "@/components/FeaturedStore"; // New component we'll create
import AddressSearchModal from "@/components/modal/address-search-modal";
import { useAddress } from "@/contexts/address-context";
import CurrentLocationButton from "@/components/CurrentLocationButton"; // For fallback

export default function StorePage() {
  const { address, setAddress, setCoordinates } = useAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an address in context on page load
    if (!address) {
      // If no address, get current location
      handleGetCurrentLocation();
    }
  }, [address]);

  const handleGetCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
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
            throw new Error("Unable to find address");
          }
          setIsLoading(false);
        } catch (err) {
          setError("Error fetching your address");
          setIsLoading(false);
        }
      },
      (err) => {
        setError("Unable to retrieve your location");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderStore
        deliveryAddress={address}
        onAddressClick={() => setIsModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories Section */}
        <CategoriesInStore />

        {/* Featured Stores Section */}
        <FeaturedStore deliveryAddress={address} />
      </main>

      {/* Footer */}
      <FooterStore />

      {/* Address Search Modal */}
      <AddressSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Loading and Error States */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white">Fetching your location...</div>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-red-500">{error}</div>
        </div>
      )}
    </div>
  );
}
