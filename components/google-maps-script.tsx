"use client";

import Script from "next/script";
import { useEffect } from "react";

// Define a global callback function for Google Maps
declare global {
  interface Window {
    initMap: () => void;
  }
}

export default function GoogleMapsScript() {
  useEffect(() => {
    // Define the callback function
    window.initMap = () => {
      console.log("Google Maps API loaded successfully");
    };
  }, []);

  return (
    <Script
      src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`}
      strategy="afterInteractive" // Load after hydration
      onError={(e) => {
        console.error("Google Maps API failed to load:", e);
      }}
      onLoad={() => {
        console.log("Script loaded"); // Optional: Confirm script load
      }}
    />
  );
}
