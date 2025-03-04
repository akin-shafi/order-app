"use client";

import { useState } from "react";
import Script from "next/script";

export default function GoogleMapsScript() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setLoaded(true)}
        />
      )}
    </>
  );
}
