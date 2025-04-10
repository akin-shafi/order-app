// src/components/meal-plan/MealSelection.tsx
import React, { useState } from "react";
import MealSwapModal from "@/components/modal/MealSwapModal";

interface DailyMeal {
  date: string;
  day: string;
  meal: { name: string; description: string; price: number };
}

interface MealPlan {
  breakfast: DailyMeal[];
  lunch: DailyMeal[];
}

interface MealSelectionProps {
  activeTab: "Breakfast" | "Lunch";
  setActiveTab: (tab: "Breakfast" | "Lunch") => void;
  mealPlan: MealPlan | null;
  costs: { breakfast: number; lunch: number };
  deliveryFees: { breakfast: number; lunch: number };
  deliveryAddress: string;
  handleCalculateCost: (type: "breakfast" | "lunch") => Promise<void>;
  handleSwapMeal: (
    type: "breakfast" | "lunch",
    index: number,
    newMeal: { name: string; description: string; price: number }
  ) => Promise<void>;
  setStep: (step: number) => void;
  loading: boolean;
}

const MealSelection: React.FC<MealSelectionProps> = ({
  activeTab,
  setActiveTab,
  mealPlan,
  costs,
  deliveryFees,
  deliveryAddress,
  handleCalculateCost,
  handleSwapMeal,
  setStep,
  loading,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(
    null
  );

  const openModal = (index: number) => {
    setSelectedMealIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMealIndex(null);
  };

  const onSelectMeal = async (newMeal: {
    name: string;
    description: string;
    price: number;
  }) => {
    if (selectedMealIndex !== null) {
      await handleSwapMeal(
        activeTab.toLowerCase() as "breakfast" | "lunch",
        selectedMealIndex,
        newMeal
      );
    }
    closeModal();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#292d32] mb-4">
        Select Your Meals
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === "Breakfast"
              ? "bg-[#1A3C34] text-white"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={() => setActiveTab("Breakfast")}
        >
          Breakfast
        </button>
        <button
          className={`flex-1 py-3 text-center text-sm font-medium ${
            activeTab === "Lunch"
              ? "bg-[#1A3C34] text-white"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={() => setActiveTab("Lunch")}
        >
          Lunch
        </button>
      </div>

      {/* Meal Plan Table */}
      {mealPlan && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1A3C34] text-white text-sm">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Meal Details</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "Breakfast"
                ? mealPlan.breakfast
                : mealPlan.lunch
              ).map((dailyMeal, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-2 text-sm text-[#292d32]">
                    {dailyMeal.day}
                  </td>
                  <td className="p-2 text-sm text-[#292d32]">
                    <p className="font-medium">{dailyMeal.meal.name}</p>
                    <p className="text-gray-500">
                      {dailyMeal.meal.description}
                    </p>
                  </td>
                  <td className="p-2 text-sm text-[#292d32]">
                    ₦{dailyMeal.meal.price.toLocaleString()}
                  </td>
                  <td className="p-2">
                    <button
                      className="text-[#FF6600] text-sm hover:underline"
                      onClick={() => openModal(index)}
                    >
                      Swap Meal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cost Summary */}
      {mealPlan && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#292d32]">
              Total for {activeTab}
            </span>
            <span className="text-sm text-[#292d32]">
              {costs[activeTab.toLowerCase() as "breakfast" | "lunch"] > 0
                ? `₦${costs[
                    activeTab.toLowerCase() as "breakfast" | "lunch"
                  ].toLocaleString()}`
                : "Not Calculated"}
            </span>
          </div>
          {costs[activeTab.toLowerCase() as "breakfast" | "lunch"] > 0 && (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Delivery Fee</span>
                <span className="text-sm text-[#292d32]">
                  ₦
                  {deliveryFees[
                    activeTab.toLowerCase() as "breakfast" | "lunch"
                  ].toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Delivery Time</span>
                <span className="text-sm text-[#292d32]">
                  {activeTab === "Breakfast"
                    ? "8:00 AM - 11:00 AM"
                    : "12:00 PM - 3:00 PM"}
                </span>
              </div>
            </>
          )}
          <button
            className={`w-full py-3 rounded-lg text-white ${
              deliveryAddress && mealPlan
                ? "bg-[#FF6600]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={() =>
              handleCalculateCost(
                activeTab.toLowerCase() as "breakfast" | "lunch"
              )
            }
            disabled={!deliveryAddress || !mealPlan || loading}
          >
            {loading ? "Calculating..." : "Generate Cost"}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          className="flex-1 py-3 bg-gray-500 text-white rounded-lg"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <button
          className={`flex-1 py-3 rounded-lg text-white ${
            costs.breakfast > 0 || costs.lunch > 0
              ? "bg-[#FF6600]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          onClick={() => setStep(3)}
          disabled={!(costs.breakfast > 0 || costs.lunch > 0) || loading}
        >
          Next
        </button>
      </div>

      {/* Meal Swap Modal */}
      <MealSwapModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelectMeal={onSelectMeal}
        mealType={activeTab.toLowerCase() as "breakfast" | "lunch"}
      />
    </div>
  );
};

export default MealSelection;
