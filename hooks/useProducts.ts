// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { getAuthToken } from "@/utils/auth";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  isAvailable: boolean;
  business: {
    name: string;
    city: string;
    state: string;
  };
}

interface UseProductsProps {
  category?: string;
  searchTerm?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const token = getAuthToken();
  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products`;

  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data.products;
};

export const useProducts = ({ category, searchTerm }: UseProductsProps) => {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const filterProducts = (products: Product[]) => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.price.includes(term) ||
          product.business.name.toLowerCase().includes(term) ||
          product.business.city.toLowerCase().includes(term) ||
          product.business.state.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  return {
    products: query.data ? filterProducts(query.data) : [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
};