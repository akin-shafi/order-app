"use client";

import { useEffect, useRef, useState } from "react";
import { X, Navigation, Flag, Loader2 } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import Image from "next/image";

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlaceResult {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GeocodingResult {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface LocationDetails {
  state: string;
  localGovernment: string;
  locality: string;
  formattedAddress: string;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
}: AddressSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const { setAddress, setCoordinates } = useAddress();
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setGoogleLoaded(true);
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
        // Create a dummy div for PlacesService (required but not used directly)
        const dummyElement = document.createElement("div");
        placesService.current = new window.google.maps.places.PlacesService(
          dummyElement
        );
      } else {
        // If not loaded yet, check again after a short delay
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  // Extract location details from address components
  const extractLocationDetails = (
    addressComponents: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>
  ): LocationDetails => {
    // Default values
    let state = "";
    let localGovernment = "";
    let locality = "";
    let formattedAddress = "";

    // Extract each component
    addressComponents.forEach((component) => {
      // State (administrative_area_level_1)
      if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      }

      // Local Government (administrative_area_level_2)
      if (component.types.includes("administrative_area_level_2")) {
        localGovernment = component.long_name;
      }

      // Locality (administrative_area_level_3 or locality)
      if (component.types.includes("administrative_area_level_3")) {
        locality = component.long_name;
      } else if (locality === "" && component.types.includes("locality")) {
        locality = component.long_name;
      } else if (locality === "" && component.types.includes("neighborhood")) {
        locality = component.long_name;
      }
    });

    // Build a formatted address with the extracted components
    formattedAddress = [locality, localGovernment, state]
      .filter(Boolean)
      .join(", ");

    return {
      state,
      localGovernment,
      locality,
      formattedAddress,
    };
  };

  // Add a direct API call function as a fallback
  const searchAddressAPI = async (query: string) => {
    if (!query) return;

    try {
      // Use the Geocoding API as a fallback if Places API isn't working
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&components=country:NG&key=${
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        }`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        // Convert geocoding results to a format similar to place predictions
        const formattedResults = data.results.map((result: GeocodingResult) => {
          const locationDetails = extractLocationDetails(
            result.address_components
          );

          return {
            place_id: result.place_id,
            description: result.formatted_address,
            structured_formatting: {
              main_text:
                locationDetails.formattedAddress ||
                result.formatted_address.split(",")[0],
              secondary_text: result.formatted_address,
            },
            // Store the location details for later use
            locationDetails,
          };
        });

        setPredictions(formattedResults);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error fetching address from API:", error);
      setPredictions([]);
    }
  };

  // Update the handleSearch function to use the fallback if needed
  const handleSearch = async (input: string) => {
    setSearchQuery(input);
    if (!input) {
      setPredictions([]);
      return;
    }

    // Try using the Places API first
    if (autocompleteService.current && googleLoaded) {
      try {
        autocompleteService.current.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: "NG" }, // Restrict to Nigeria
            types: ["address"],
          },
          (predictions, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              predictions &&
              predictions.length > 0
            ) {
              console.log("Predictions received:", predictions); // Debug log
              setPredictions(predictions as unknown as PlaceResult[]);
            } else {
              console.log(
                "No predictions or error, falling back to Geocoding API:",
                status
              ); // Debug log
              // Fall back to direct API call if Places API returns no results
              searchAddressAPI(input);
            }
          }
        );
      } catch (error) {
        console.error(
          "Error with Places API, falling back to Geocoding API:",
          error
        );
        searchAddressAPI(input);
      }
    } else {
      // If Places API is not available, use the direct API call
      console.log("Places API not available, using Geocoding API");
      searchAddressAPI(input);
    }
  };

  const verifyDeliveryZone = async (locationDetails: LocationDetails) => {
    try {
      // For demo purposes, we'll simulate a successful response for specific areas
      // In a real application, you would call your backend API here

      // Example API call to your backend
      // const response = await fetch('/api/verify-delivery-zone', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     state: locationDetails.state,
      //     localGovernment: locationDetails.localGovernment,
      //     locality: locationDetails.locality,
      //   }),
      // });
      // const data = await response.json();
      // return data.isDeliverable;

      // For demo, we'll just check if it's in Lagos
      if (locationDetails.state.toLowerCase().includes("lagos")) {
        // You can add more specific checks for local government and locality
        const supportedLocalGovs = [
          "ajeromi/ifelodun",
          "apapa",
          "lagos island",
          "surulere",
        ];
        return supportedLocalGovs.some((lg) =>
          locationDetails.localGovernment
            .toLowerCase()
            .includes(lg.toLowerCase())
        );
      }
      return false;
    } catch (error) {
      console.error("Error verifying delivery zone:", error);
      return false;
    }
  };

  const handleAddressSelect = async (placeId: string, description: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedAddress(description);
    setPredictions([]);

    try {
      if (!placesService.current) {
        throw new Error("Places service not available");
      }

      placesService.current.getDetails(
        {
          placeId: placeId,
          fields: ["formatted_address", "geometry", "address_components"],
        },
        async (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            // Extract location details
            const locationDetails = extractLocationDetails(
              place.address_components || []
            );

            console.log("Extracted location details:", locationDetails);

            if (!locationDetails.state || !locationDetails.localGovernment) {
              setError("Unable to determine location details");
              setIsLoading(false);
              return;
            }

            const isDeliverable = await verifyDeliveryZone(locationDetails);

            if (!isDeliverable) {
              setError(
                `Sorry, we don't deliver to ${
                  locationDetails.formattedAddress || description
                } yet.`
              );
              setShowMap(true);
              setIsLoading(false);
              return;
            }

            // Success - update address and close modal
            setAddress(description);
            if (place.geometry?.location) {
              setCoordinates({
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
              });
            }
            setIsLoading(false);
            onClose();
          } else {
            setError("Error processing your address. Please try again.");
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Error processing address:", error);
      setError("Error processing your address. Please try again.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Add a delivery address</h2>

          <div className="relative mb-4">
            <Flag
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for streets, cities, districts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15736] focus:border-transparent"
              autoComplete="off"
            />
          </div>

          {/* Predictions Dropdown */}
          {predictions.length > 0 && !isLoading && !error && (
            <div
              className="fixed left-6 right-6 md:left-auto md:right-auto md:w-[calc(100%-48px)] max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-[100]"
              style={{ top: "auto" }}
            >
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  onClick={() =>
                    handleAddressSelect(
                      prediction.place_id,
                      prediction.description
                    )
                  }
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none"
                >
                  <div className="font-medium">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-sm text-gray-500">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Google Maps API Status */}
          {!googleLoaded && (
            <div className="text-amber-500 text-sm mb-4">
              Loading Google Maps API...
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500 my-4">
              <Loader2 className="animate-spin" size={20} />
              <span>Verifying address...</span>
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Map Preview */}
          {showMap && selectedAddress && (
            <div className="mt-4 rounded-lg overflow-hidden h-48 relative">
              <Image
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                  selectedAddress
                )}&zoom=15&size=400x200&key=${
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                }`}
                alt="Location Map"
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Use Current Location Button */}
          <button
            onClick={() => {
              onClose();
              // Trigger the getCurrentLocation function from AddressField
              document.dispatchEvent(new Event("getCurrentLocation"));
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#e8f5f3] text-[#00a082] py-3 rounded-full hover:bg-[#d7eae7] transition-colors"
          >
            <Navigation size={20} />
            Use current location
          </button>
        </div>
      </div>
    </div>
  );
}
