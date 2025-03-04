/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { MapPin, Navigation, Search, Loader2 } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import AddressSearchModal from "./modal/address-search-modal";
import { useRouter } from "next/navigation";
import { Select } from "antd"; // Import Ant Design Select
import { SEARCH_OPTIONS } from "@/data/content";
// import "./AddressField.css"; // We'll add custom CSS

const { Option, OptGroup } = Select;

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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Optional delay
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
      {/* Address Input */}
      <div className="flex flex-col sm:flex-row gap-2 p-1 bg-transparent sm:bg-white rounded-full max-w-md mx-auto md:mx-0 animate-fadeInUp">
        <div className="flex-1 flex items-center bg-white rounded-full pl-2">
          <MapPin className="text-[#f15736] h-5 w-5 mr-2" />
          <input
            type="text"
            placeholder="What is your address?"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError(null);
            }}
            onFocus={() => setIsModalOpen(true)}
            className="bg-white rounded-full border-none outline-none w-full py-2 text-sm text-black placeholder-black"
            style={{ fontFamily: "inherit", fontSize: "inherit" }}
          />
        </div>
        {!address && (
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors disabled:opacity-70"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Use current location
          </button>
        )}
      </div>
      {/* Loading State for location */}
      {isLoading && (
        <div className="absolute left-0 right-0 text-center mt-2 flex items-center justify-center gap-2 animate-fadeIn">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-sm text-black font-bold">
            Fetching your location...
          </span>
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="absolute left-0 right-0 text-center mt-2 text-red-500 text-sm animate-fadeIn">
          {error}
        </div>
      )}
      {/* Search Input with Dropdown */}
      {address && (
        <div className="relative max-w-md mx-auto md:mx-0 animate-fadeInUp">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Select
              showSearch
              placeholder="What can we get you?"
              value={searchQuery || undefined}
              // Use undefined for placeholder to show
              onChange={(value) => {
                setSearchQuery(value);
                setError(null);
              }}
              filterOption={(input, option) =>
                (option?.label?.toString().toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
              className="custom-ant-select w-full"
              dropdownStyle={{ borderRadius: "8px" }}
            >
              {SEARCH_OPTIONS.map((category) => (
                <OptGroup key={category.category} label={category.category}>
                  {category.items.map((item) => (
                    <Option
                      key={item.value}
                      value={item.value}
                      label={item.label}
                    >
                      {item.label}
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </div>
          <button
            onClick={handleSendRequest}
            disabled={isButtonDisabled}
            className="w-full mt-8 bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors disabled:opacity-70"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </button>
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
