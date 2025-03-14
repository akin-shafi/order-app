import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@/contexts/address-context";

// Adjusted interface to match the desired output
interface RecommendedBusiness {
  name: string;
  image: string | null;
  rating: string;
  deliveryTime: string;
  tags: string[];
  status: string; // Will be determined by openingTime and closingTime
  preOrder: boolean;
  businessType: string;
  productCategories: string[];
}

// Adjusted interface to match the updated payload structure
interface APIBusiness {
  name: string;
  image: string | null;
  city: string;
  rating: string;
  ratingCount: number;
  priceRange: string;
  deliveryTimeRange: string | null;
  businessType: string;
  productCategories: string[];
  openingTime: string; // e.g., "08:00:00"
  closingTime: string; // e.g., "22:00:00"
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

const fetchRecommendations = async (city: string, state: string): Promise<RecommendedBusiness[]> => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/top-rated`;

  const normalizedCity = city
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");
  const params = new URLSearchParams({
    page: "1",
    limit: "5",
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    minRating: "0",
  });

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  const data = await response.json();

  // Transform the API response to match RecommendedBusiness interface
  return data.data.businesses.map((business: APIBusiness) => ({
    name: business.name,
    image: business.image,
    rating: business.rating,
    deliveryTime: business.deliveryTimeRange || "Not specified",
    tags: [],
    status: isBusinessOpen(business.openingTime, business.closingTime) ? "open" : "closed",
    preOrder: false,
    businessType: business.businessType,
    productCategories: business.productCategories,
  }));
};

export const useRecommendations = () => {
  const { locationDetails } = useAddress();

  return useQuery({
    queryKey: ["recommendations", locationDetails?.localGovernment, locationDetails?.state],
    queryFn: () => {
      if (!locationDetails?.localGovernment || !locationDetails?.state) {
        throw new Error("Location not set");
      }
      return fetchRecommendations(locationDetails.localGovernment, locationDetails.state);
    },
    enabled: !!locationDetails?.localGovernment && !!locationDetails?.state,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};