// hooks/useBusiness.ts
import { useQuery } from "@tanstack/react-query";

interface Business {
  status: string;
  businessType: string;
  productCategories: string[];
  id: string;
  name: string;
  image: string;
  city: string;
  priceRange: string | null;
  deliveryTime: string | null;
  rating: string;
  ratingCount: number;
  openingTime: string;
  closingTime: string;
}

interface UseBusinessProps {
  address: string | null;
  localGovernment: string | undefined;
  state: string | undefined;
  businessType?: string; // Renamed from category
  subcategory?: string | null;
}

const isBusinessOpen = (openingTime: string, closingTime: string): boolean => {
  const now = new Date();
  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }
  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
};

const fetchBusinesses = async ({ localGovernment, state, businessType, subcategory }: Omit<UseBusinessProps, 'address'>): Promise<Business[]> => {
  if (!localGovernment || !state) {
    throw new Error("Waiting for location data...");
  }

  const normalizedCity = localGovernment
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");

  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/filter`;
  const params = new URLSearchParams({
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    businessType: businessType || "Restaurants" // Default to Restaurants
  });
  
  if (subcategory) {
    params.set("subcategory", subcategory);
  }
  
  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.statusText}`);
  }

  const data = await response.json();

  return data.businesses.map((business: Business) => ({
    id: business.id,
    name: business.name,
    image: business.image,
    rating: business.rating,
    openingTime: business.openingTime,
    closingTime: business.closingTime,
    deliveryTime: business.deliveryTime || "15 - 20 mins",
    status: isBusinessOpen(business.openingTime, business.closingTime) ? "open" : "closed",
    businessType: business.businessType,
    productCategories: business.productCategories,
  }));
};

export const useBusiness = ({ address, localGovernment, state, businessType, subcategory }: UseBusinessProps) => {
  const query = useQuery({
    queryKey: ['businesses', localGovernment, state, businessType, subcategory],
    queryFn: () => fetchBusinesses({ localGovernment, state, businessType, subcategory }),
    enabled: !!address && !!localGovernment && !!state,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    businesses: query.data || [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
};