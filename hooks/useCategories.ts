import { useQuery } from '@tanstack/react-query';
import { categories } from '@/data/content';

export interface Category {
  name: string;
  image: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      // In a real app, this would be an API call
      // For now, we'll simulate an API call with the static data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return categories;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}; 