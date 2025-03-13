import { useQuery } from "@tanstack/react-query";

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
  return data.businesses.map((b: Business, index: number) => ({
    ...b,
    id: b.id || `temp-id-${index}`,
  }));
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



