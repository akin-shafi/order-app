// src/hooks/useMealPlan.ts
import { useMutation } from "@tanstack/react-query";
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

interface MealPlan {
  breakfast: DailyMeal[];
  lunch: DailyMeal[];
}

interface GenerateMealPlanRequest {
  startDate: string;
  deliveryAddress: string;
}

interface GenerateMealPlanResponse {
  statusCode: number;
  message: string;
  mealPlan: MealPlan;
}

interface CalculateCostRequest {
  mealPlan: DailyMeal[];
  deliveryAddress: string;
}

interface CalculateCostResponse {
  statusCode: number;
  message: string;
  totalCost: number;
  deliveryFee: number;
}

interface ActivateScheduleRequest {
  mealPlan: { breakfast: DailyMeal[]; lunch: DailyMeal[] };
  totalCost: number;
  deliveryAddress: string;
  startDate: string;
  paymentMethod: "wallet" | "online";
}

interface ActivateScheduleResponse {
  statusCode: number;
  message: string;
  success: boolean;
}

interface SaveMealPlanRequest {
  mealPlan: { breakfast: DailyMeal[]; lunch: DailyMeal[] };
  totalCost: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  deliveryAddress: string;
  startDate: string;
}

interface SaveMealPlanResponse {
  statusCode: number;
  message: string;
  success: boolean;
  savedPlanId: string;
}

const generateMealPlan = async (data: GenerateMealPlanRequest): Promise<GenerateMealPlanResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to generate meal plan");
  }

  return response.json();
};

const calculateCost = async (data: CalculateCostRequest): Promise<CalculateCostResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/calculate-cost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to calculate cost");
  }

  return response.json();
};

const activateSchedule = async (data: ActivateScheduleRequest): Promise<ActivateScheduleResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/activate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to activate schedule");
  }

  return response.json();
};

const saveMealPlan = async (data: SaveMealPlanRequest): Promise<SaveMealPlanResponse> => {
  const token = getAuthToken();
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal-plan/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to save meal plan");
  }

  return response.json();
};

export const useMealPlan = () => {
  const generateMutation = useMutation<GenerateMealPlanResponse, Error, GenerateMealPlanRequest>({
    mutationFn: generateMealPlan,
  });

  const calculateCostMutation = useMutation<CalculateCostResponse, Error, CalculateCostRequest>({
    mutationFn: calculateCost,
  });

  const activateMutation = useMutation<ActivateScheduleResponse, Error, ActivateScheduleRequest>({
    mutationFn: activateSchedule,
  });

  const saveMutation = useMutation<SaveMealPlanResponse, Error, SaveMealPlanRequest>({
    mutationFn: saveMealPlan,
  });

  return {
    generateMealPlan: generateMutation.mutateAsync,
    calculateCost: calculateCostMutation.mutateAsync,
    activateSchedule: activateMutation.mutateAsync,
    saveMealPlan: saveMutation.mutateAsync,
    loading:
      generateMutation.isPending ||
      calculateCostMutation.isPending ||
      activateMutation.isPending ||
      saveMutation.isPending,
    error:
      generateMutation.error?.message ||
      calculateCostMutation.error?.message ||
      activateMutation.error?.message ||
      saveMutation.error?.message ||
      null,
  };
};