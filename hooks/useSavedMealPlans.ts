// src/hooks/useSavedMealPlans.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAuthToken } from "@/utils/auth";

interface Meal {
  name: string;
  description: string;
  price: number;
}

interface DailyMeal {
  date: string;
  day: string;
  meal: Meal;
}

// interface MealPlan {
//   breakfast: DailyMeal[];
//   lunch: DailyMeal[];
// }

interface SavedMealPlan {
  id: string;
  mealPlan: { breakfast: DailyMeal[]; lunch: DailyMeal[] };
  totalCost: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  deliveryAddress: string;
  startDate: string;
  endDate: string; // Add endDate
  status: "active" | "inactive";
  numberOfPlates: number; // Add numberOfPlates
}

interface SavedMealPlansResponse {
  statusCode: number;
  message: string;
  plans: SavedMealPlan[];
}

interface ActivateSavedPlanRequest {
  planId: string;
  paymentMethod: "wallet" | "online";
}

interface ActivateSavedPlanResponse {
  statusCode: number;
  message: string;
  success: boolean;
}

const fetchSavedMealPlans = async (): Promise<SavedMealPlansResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/saved`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch saved meal plans");
  }

  return response.json();
};

const activateSavedPlan = async (data: ActivateSavedPlanRequest): Promise<ActivateSavedPlanResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/activate-saved`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to activate saved plan");
  }

  return response.json();
};

export const useSavedMealPlans = () => {
  const savedPlansQuery = useQuery<SavedMealPlansResponse, Error>({
    queryKey: ["savedMealPlans"],
    queryFn: fetchSavedMealPlans,
  });

  const activateMutation = useMutation<ActivateSavedPlanResponse, Error, ActivateSavedPlanRequest>({
    mutationFn: activateSavedPlan,
  });

  return {
    savedPlans: savedPlansQuery.data?.plans || [],
    loading: savedPlansQuery.isLoading || activateMutation.isPending,
    error: savedPlansQuery.error?.message || activateMutation.error?.message || null,
    refetch: savedPlansQuery.refetch,
    activateSavedPlan: activateMutation.mutateAsync,
  };
};