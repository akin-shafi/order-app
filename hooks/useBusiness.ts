
import { useState, useEffect,  } from "react";

interface Business {
  businessType: string;
  productCategories: string[];
  id: string;
  name: string;
  image: string;
  city: string;
  priceRange: string | null;
  deliveryTimeRange: string | null;
  rating: string;
  ratingCount: number;
}

interface UseBusinessProps {
  address: string | null;
  localGovernment: string | undefined;
  state: string | undefined;
  category?: string;
}

export const useBusiness = ({ address, localGovernment, state, category }: UseBusinessProps) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true); // Start as true to indicate initial load
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      // console.log("useBusiness inputs:", { address, localGovernment, state, category });

      // Only fetch if all required fields are present
      if (!address || !localGovernment || !state) {
        setBusinesses([]);
        setError("Waiting for location data...");
        setLoading(false); // Stop loading if data is incomplete
        return;
      }

      setLoading(true);
      setError(null);

      const normalizedCity = localGovernment
        .replace(/\s+/g, "-")
        .replace(/\//g, "-");
      console.log("Normalized city:", normalizedCity);

      const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/filter`;
      const params = new URLSearchParams({
        city: encodeURIComponent(normalizedCity),
        state: encodeURIComponent(state),
      });
      if (category) {
        params.set("category", category);
      }
      const url = `${baseUrl}?${params.toString()}`;
      // console.log("Fetching businesses from:", url);

      try {
        const response = await fetch(url);
        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Failed to fetch businesses: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log("Fetched data:", data);

        const businessesData = data.businesses.map((b: Business, index: number) => ({
          ...b,
          id: b.id || `temp-id-${index}`,
        }));
        setBusinesses(businessesData);
      } catch (err) {
        setError("Error loading featured businesses");
        setBusinesses([]);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [address, localGovernment, state, category]);

  return { businesses, loading, error };
};