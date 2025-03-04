// hooks/useGeolocation.ts
import { useState } from "react";
import { useAddress } from "@/contexts/address-context"; // Assuming this is your context path

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAddress, setCoordinates, setLocationDetails, locationDetails } = useAddress();

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Geocoding API request failed");
      }
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      throw new Error("Unable to find address");
    } catch (err) {
      throw new Error("Error fetching address: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    const locationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            if (!latitude || !longitude) {
              throw new Error("Invalid coordinates received");
            }

            const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
            setAddress(fetchedAddress);
            setCoordinates({ latitude, longitude });
            setLocationDetails({
              ...locationDetails,
              latitude,
              longitude,
            });
            setIsLoading(false);
            resolve();
          } catch (error) {
            setError(
              error instanceof Error 
                ? error.message 
                : "Error fetching your address"
            );
            setIsLoading(false);
            reject(error);
          }
        },
        (geoError) => {
          let errorMessage = "Unable to retrieve your location";
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions.";
              break;
            case geoError.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case geoError.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          setError(errorMessage);
          setIsLoading(false);
          reject(geoError);
        },
        locationOptions
      );
    });
  };

  return {
    isLoading,
    error,
    getCurrentLocation,
    setError,
  };
}