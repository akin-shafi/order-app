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
  // deliveryTimeRange: string | null;
  rating: string;
  ratingCount: number;
  openingTime: string; // e.g., "08:00:00"
  closingTime: string; // e.g., "22:00:00"
}



interface UseBusinessProps {
  address: string | null;
  localGovernment: string | undefined;
  state: string | undefined;
  category?: string;
}

// Function to determine if a business is open based on current time
const isBusinessOpen = (openingTime: string, closingTime: string): boolean => {
  const now = new Date(); // Use current time; for testing, you could set to new Date("2025-03-13T12:00:00")
  const [openHour, openMinute] = openingTime.split(":").map(Number);
  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Handle cases where closing time is past midnight (e.g., 22:00 to 02:00)
  if (closeTimeInMinutes < openTimeInMinutes) {
    return (
      currentTimeInMinutes >= openTimeInMinutes ||
      currentTimeInMinutes < closeTimeInMinutes
    );
  }

  // Normal case: opening time is before closing time
  return (
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes
  );
};

const fetchBusinesses = async ({ localGovernment, state, category }: Omit<UseBusinessProps, 'address'>): Promise<Business[]> => {
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
    businessType: "Restaurant"
  });
  
  if (category) {
    params.set("category", category);
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
    deliveryTime: business.deliveryTime || "Not specified",
    tags: [],
    status: isBusinessOpen(business.openingTime, business.closingTime) ? "open" : "closed",
    preOrder: false,
    businessType: business.businessType,
    productCategories: business.productCategories,
  }));

  // return data.businesses.map((b: Business, index: number) => ({
  //   ...b,
  //   id: b.id || `temp-id-${index}`,
  // }));
};

export const useBusiness = ({ address, localGovernment, state, category }: UseBusinessProps) => {
  const query = useQuery({
    queryKey: ['businesses', localGovernment, state, category],
    queryFn: () => fetchBusinesses({ localGovernment, state, category }),
    enabled: !!address && !!localGovernment && !!state,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    businesses: query.data || [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
};



