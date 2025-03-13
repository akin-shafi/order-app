import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@/contexts/address-context";

interface RecommendedBusiness {
  id: string;
  name: string;
  image: string | null;
  rating: string;
  deliveryTime: string;
  tags: string[];
  status: string;
  preOrder: boolean;
  businessType: string;
  productCategories: string[];
}

interface APIBusiness {
  id: string;
  name: string;
  image: string | null;
  rating: string;
  deliveryTimeRange: string | null;
  products: Array<{
    categories: string[];
  }>;
  isActive: boolean;
  deliveryOptions: string[];
}

const fetchRecommendations = async (city: string, state: string): Promise<RecommendedBusiness[]> => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/businesses/top-rated`;

  const normalizedCity = city
    .replace(/\s+/g, "-")
    .replace(/\//g, "-");
  const params = new URLSearchParams({
    page: '1',
    limit: '5',
    city: encodeURIComponent(normalizedCity),
    state: encodeURIComponent(state),
    minRating: '0'
  });
  
  const url = `${baseUrl}?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch recommendations');
  }

  const data = await response.json();
  
  // Transform the API response to match our interface
  return data.data.businesses.map((business: APIBusiness) => ({
    id: business.id,
    name: business.name,
    image: business.image,
    rating: business.rating,
    deliveryTime: business.deliveryTimeRange || '30-45 mins',
    tags: business.deliveryOptions,
    status: business.isActive ? 'open' : 'closed',
    preOrder: false, // Not available in API response
    businessType: business.products[0]?.categories[0] || 'Restaurant', // Use first product category as business type
    productCategories: Array.from(new Set(business.products.flatMap(p => p.categories)))
  }));
};

export const useRecommendations = () => {
  const { locationDetails } = useAddress();
  
  return useQuery({
    queryKey: ['recommendations', locationDetails?.localGovernment, locationDetails?.state],
    queryFn: () => {
      if (!locationDetails?.localGovernment || !locationDetails?.state) {
        throw new Error('Location not set');
      }
      return fetchRecommendations(locationDetails.localGovernment, locationDetails.state);
    },
    enabled: !!locationDetails?.localGovernment && !!locationDetails?.state,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 