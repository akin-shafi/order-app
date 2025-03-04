// components/address/AddressField.tsx
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "../modal/address-search-modal";
import { useRouter } from "next/navigation";
import { AddressInput } from "./AddressInput";
import { LocationButton } from "./LocationButton";
import { StatusDisplay } from "./StatusDisplay";
import { SearchDropdown } from "./SearchDropdown";
import { SEARCH_OPTIONS } from "@/data/content";
// Business categories and items (could be moved to a separate constants file)

export default function AddressField() {
  const {
    address,
    setAddress,
    setCoordinates,
    setLocationDetails,
    locationDetails,
  } = useAddress();
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
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

  const handleSendRequest = async () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }
    if (!searchQuery.trim()) {
      setError("Please select what you want");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        address: address,
        search: searchQuery,
        state: locationDetails.state || "",
        localGovernment: locationDetails.localGovernment || "",
        locality: locationDetails.locality || "",
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/store`);
    } catch (error) {
      setError("Error processing request");
      setIsSending(false);
    }
  };

  const isButtonDisabled =
    isLoading || isSending || !address.trim() || !searchQuery.trim();

  return (
    <div className="relative space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 p-1 bg-transparent sm:bg-white rounded-full max-w-md mx-auto md:mx-0 animate-fadeInUp">
        <AddressInput
          address={address}
          setAddress={setAddress}
          setError={setError}
          setIsModalOpen={setIsModalOpen}
        />
        <LocationButton
          isLoading={isLoading}
          onGetLocation={getCurrentLocation}
          address={address}
        />
      </div>
      <StatusDisplay isLoading={isLoading} error={error} />
      <SearchDropdown
        address={address}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setError={setError}
        isSending={isSending}
        isButtonDisabled={isButtonDisabled}
        onSendRequest={handleSendRequest}
        SEARCH_OPTIONS={SEARCH_OPTIONS}
      />
      <AddressSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
