/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "./modal/address-search-modal";

export default function AddressField() {
  const { address, setAddress, setCoordinates } = useAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Listen for getCurrentLocation event from modal
    const handleGetCurrentLocation = () => {
      getCurrentLocation();
    };
    document.addEventListener("getCurrentLocation", handleGetCurrentLocation);
    return () => {
      document.removeEventListener(
        "getCurrentLocation",
        handleGetCurrentLocation
      );
    };
  }, []);

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      throw new Error("Unable to find address");
    } catch (error) {
      throw new Error("Error fetching address");
    }
  };

  const getCurrentLocation = () => {
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
          const fetchedAddress = await getAddressFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );
          setAddress(fetchedAddress);
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoading(false);
        } catch (error) {
          setError("Error fetching your address");
          setIsLoading(false);
        }
      },
      (error) => {
        setError("Unable to retrieve your location");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="relative space-y-4">
      {/* Address Input */}
      <div className="flex flex-col sm:flex-row gap-2 sm:bg-white p-1 rounded-full max-w-md mx-auto md:mx-0 animate-fadeInUp">
        <div className="flex-1 flex items-center bg-white rounded-full pl-2">
          <MapPin className="text-[#f15736] h-5 w-5 mr-2" />
          <input
            type="text"
            placeholder="What is your address?"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => setIsModalOpen(true)}
            className="bg-transparent border-none outline-none w-full py-2 text-sm"
          />
        </div>
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors disabled:opacity-70"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Use current location
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute left-0 right-0 text-center mt-2 flex items-center justify-center gap-2 animate-fadeIn">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm text-white">Fetching your location...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute left-0 right-0 text-center mt-2 text-red-500 text-sm animate-fadeIn">
          {error}
        </div>
      )}

      {/* Search Input - Only show when address is set */}
      {address && (
        <div className="relative max-w-md mx-auto md:mx-0 animate-fadeInUp">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="What can we get you?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border-none outline-none shadow-sm text-sm"
            />
          </div>
        </div>
      )}

      {/* Address Search Modal */}
      <AddressSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
