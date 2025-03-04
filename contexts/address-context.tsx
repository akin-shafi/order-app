"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AddressContextType {
  address: string;
  setAddress: (address: string) => void;
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  setCoordinates: (coords: {
    latitude: number | null;
    longitude: number | null;
  }) => void;
  locationDetails: {
    state: string;
    localGovernment: string;
    locality: string;
  };
  setLocationDetails: (details: {
    state: string;
    localGovernment: string;
    locality: string;
  }) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [locationDetails, setLocationDetails] = useState<{
    state: string;
    localGovernment: string;
    locality: string;
  }>({
    state: "",
    localGovernment: "",
    locality: "",
  });

  return (
    <AddressContext.Provider
      value={{
        address,
        setAddress,
        coordinates,
        setCoordinates,
        locationDetails,
        setLocationDetails,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
}
