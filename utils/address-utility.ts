/* eslint-disable @typescript-eslint/no-explicit-any */
// utils.ts
import { LocationDetails } from "../types/address";

export const extractLocationDetails = (
  addressComponents: google.maps.GeocoderAddressComponent[] = []
): LocationDetails => {
  const details: LocationDetails = {
    street_number: "",
    route: "",
    sublocality: "",
    locality: "",
    localGovernment: "",
    administrative_area: "",
    country: "",
    formattedAddress: "",
  };

  addressComponents.forEach((component) => {
    if (component.types.includes("street_number")) {
      details.street_number = component.long_name;
    }
    if (component.types.includes("route")) {
      details.route = component.long_name;
    }
    if (
      component.types.includes("sublocality") ||
      component.types.includes("sublocality_level_1")
    ) {
      details.sublocality = component.long_name;
    }
    if (component.types.includes("locality")) {
      details.locality = component.long_name;
    }
    if (component.types.includes("administrative_area_level_2")) {
      details.localGovernment = component.long_name;
    }
    if (component.types.includes("administrative_area_level_1")) {
      details.administrative_area = component.long_name;
    }
    if (component.types.includes("country")) {
      details.country = component.long_name;
    }
  });

  details.formattedAddress = [
    details.street_number ? `${details.street_number}` : "",
    details.route,
    details.sublocality ? `off ${details.sublocality}` : "",
    details.locality,
    details.administrative_area,
  ]
    .filter(Boolean)
    .join(", ");

  return details;
};

export const verifyDeliveryZone = async (locationDetails: LocationDetails) => {
  try {
    const response = await fetch("/api/verify-delivery-zone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: locationDetails.administrative_area,
        localGovernment: locationDetails.localGovernment,
        locality: locationDetails.locality,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Delivery zone verification failed");
    }
    return data.isDeliverable;
  } catch (error) {
    console.error("Error verifying delivery zone:", error);
    return false;
  }
};

export const reverseGeocode = async (latitude: number, longitude: number) => {
  const geocoder = new window.google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any[], status: string) => {
        if (status === "OK" && results[0]) {
          const place = results[0];
          const locationDetails = extractLocationDetails(place.address_components);
          resolve({
            formattedAddress: place.formatted_address,
            ...locationDetails,
            latitude,
            longitude,
          });
        } else {
          reject(new Error("Reverse geocoding failed"));
        }
      }
    );
  });
};