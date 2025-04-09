// src/components/modal/WeeklyMealPlanModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import { X, ChevronLeft, Calendar, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete"; // Import the new hook
import ActivateScheduleModal from "@/components/modal/ActivateScheduleModal";

interface WeeklyMealPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

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

const WeeklyMealPlanModal: React.FC<WeeklyMealPlanModalProps> = ({
  isOpen,
  onClose,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<"Breakfast" | "Lunch">(
    "Breakfast"
  );
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [costs, setCosts] = useState<{ breakfast: number; lunch: number }>({
    breakfast: 0,
    lunch: 0,
  });
  const [deliveryFees, setDeliveryFees] = useState<{
    breakfast: number;
    lunch: number;
  }>({ breakfast: 0, lunch: 0 });
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  const { generateMealPlan, calculateCost, loading, error } = useMealPlan();
  const {
    input,
    setInput,
    suggestions,
    loading: addressLoading,
    error: addressError,
  } = useAddressAutocomplete();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  const handleGenerateMealPlan = async () => {
    if (!startDate || !deliveryAddress) return;
    const response = await generateMealPlan({
      startDate: startDate.toISOString(),
      deliveryAddress,
    });
    if (response) {
      setMealPlan(response.mealPlan);
    }
  };

  const handleCalculateCost = async (type: "breakfast" | "lunch") => {
    if (!mealPlan || !deliveryAddress) return;
    const response = await calculateCost({
      mealPlan: mealPlan[type],
      deliveryAddress,
    });
    if (response) {
      setCosts((prev) => ({ ...prev, [type]: response.totalCost }));
      setDeliveryFees((prev) => ({ ...prev, [type]: response.deliveryFee }));
    }
  };

  const handleSwapMeal = async (type: "breakfast" | "lunch", index: number) => {
    if (!mealPlan || !mealPlan[type] || !mealPlan[type][index]) {
      console.error(
        "Cannot swap meal: mealPlan is not defined or invalid index"
      );
      return;
    }

    const newMeal = {
      name: `New ${type} Meal`,
      description: "Swapped meal",
      price: 1200,
    };

    const updatedPlan: MealPlan = {
      breakfast: [...mealPlan.breakfast],
      lunch: [...mealPlan.lunch],
    };

    updatedPlan[type][index] = {
      ...updatedPlan[type][index],
      meal: newMeal,
    };

    setMealPlan(updatedPlan);

    if (costs[type] > 0) {
      handleCalculateCost(type);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWeekDates = (start: Date) => {
    const dates: { date: string; day: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        day: formatDate(date),
      });
    }
    return dates;
  };

  const weekDates = startDate ? getWeekDates(startDate) : [];

  const handleSelectAddress = (suggestion: {
    description: string;
    details: { formattedAddress: string } | null;
  }) => {
    const address =
      suggestion.details?.formattedAddress || suggestion.description;
    setDeliveryAddress(address);
    setInput(address); // Update the input to reflect the selected address
    setIsAddressFormOpen(false); // Close the form after selection
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
            onClick={handleBackdropClick}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="h-full overflow-y-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <button
                    className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={onBack}
                    aria-label="Back to profile"
                  >
                    <ChevronLeft
                      size={24}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  </button>
                  <h2 className="text-lg font-semibold text-[#292d32]">
                    Weekly Meal Plan
                  </h2>
                  <button
                    className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X
                      size={24}
                      className="transition-transform group-hover:scale-110"
                    />
                    <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  </button>
                </div>

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

                {/* Content */}
                <div className="p-4 space-y-4">
                  {/* Start Date Selection */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#292d32]">
                        Start Date
                      </span>
                      <button
                        className="flex items-center gap-2 text-[#FF6600]"
                        onClick={() => setIsDatePickerOpen(true)}
                        aria-label="Select start date for meal plan"
                      >
                        <Calendar size={20} />
                        <span>Select Date</span>
                      </button>
                    </div>
                    {startDate && (
                      <p className="mt-2 text-sm text-[#292d32]">
                        {formatDate(startDate)}
                      </p>
                    )}
                    {isDatePickerOpen && (
                      <div className="mt-2">
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date | null) => {
                            if (date) {
                              setStartDate(date);
                            }
                            setIsDatePickerOpen(false);
                          }}
                          minDate={new Date()}
                          inline
                          onClickOutside={() => setIsDatePickerOpen(false)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Delivery Address with Autocomplete */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#292d32]">
                        Delivery Address
                      </span>
                      <button
                        className="flex items-center gap-2 text-[#FF6600]"
                        onClick={() => setIsAddressFormOpen(true)}
                      >
                        <MapPin size={20} />
                        <span>
                          {deliveryAddress ? "Change Address" : "Add Address"}
                        </span>
                      </button>
                    </div>
                    {deliveryAddress && (
                      <p className="mt-2 text-sm text-[#292d32]">
                        {deliveryAddress}
                      </p>
                    )}
                    {isAddressFormOpen && (
                      <div className="mt-4 space-y-2 relative">
                        <input
                          type="text"
                          placeholder="Enter delivery address"
                          className="w-full p-2 border border-gray-200 rounded-lg"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          aria-label="Enter delivery address"
                        />
                        {/* Suggestions Dropdown */}
                        {suggestions.length > 0 && (
                          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectAddress(suggestion)}
                              >
                                {suggestion.description}
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* Loading and Error States */}
                        {addressLoading && (
                          <p className="text-sm text-gray-500 mt-2">
                            Loading suggestions...
                          </p>
                        )}
                        {addressError && (
                          <p className="text-sm text-red-500 mt-2">
                            {addressError}
                          </p>
                        )}
                        <button
                          className="w-full py-2 bg-[#FF6600] text-white rounded-lg"
                          onClick={() => {
                            // If no suggestion is selected, use the raw input as the address
                            if (!deliveryAddress && input) {
                              setDeliveryAddress(input);
                            }
                            setIsAddressFormOpen(false);
                          }}
                          disabled={!input}
                        >
                          Save Address
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Generate Meal Plan Button */}
                  {!mealPlan && (
                    <button
                      className={`w-full py-3 rounded-lg text-white ${
                        startDate && deliveryAddress
                          ? "bg-[#FF6600]"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      onClick={handleGenerateMealPlan}
                      disabled={!startDate || !deliveryAddress || loading}
                    >
                      {loading ? "Generating..." : "Generate Meal Plan"}
                    </button>
                  )}

                  {/* Meal Plan Display */}
                  {mealPlan && (
                    <div className="space-y-4">
                      {(activeTab === "Breakfast"
                        ? mealPlan.breakfast
                        : mealPlan.lunch
                      ).map((dailyMeal, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-[#292d32]">
                              {dailyMeal.day}
                            </span>
                            <button
                              className="text-[#FF6600] text-sm"
                              onClick={() =>
                                handleSwapMeal(
                                  activeTab.toLowerCase() as
                                    | "breakfast"
                                    | "lunch",
                                  index
                                )
                              }
                            >
                              Swap Meal
                            </button>
                          </div>
                          <div>
                            <p className="text-sm text-[#292d32]">
                              {dailyMeal.meal.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {dailyMeal.meal.description}
                            </p>
                            <p className="text-sm text-[#292d32] mt-1">
                              ₦{dailyMeal.meal.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Cost Summary */}
                  {mealPlan && (
                    <div className="border border-gray-200 rounded-lg p-4 sticky bottom-0 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-[#292d32]">
                          Total for {activeTab}
                        </span>
                        <span className="text-sm text-[#292d32]">
                          {costs[
                            activeTab.toLowerCase() as "breakfast" | "lunch"
                          ] > 0
                            ? `₦${costs[
                                activeTab.toLowerCase() as "breakfast" | "lunch"
                              ].toLocaleString()}`
                            : "Not Calculated"}
                        </span>
                      </div>
                      {costs[activeTab.toLowerCase() as "breakfast" | "lunch"] >
                        0 && (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                              Delivery Fee
                            </span>
                            <span className="text-sm text-[#292d32]">
                              ₦
                              {deliveryFees[
                                activeTab.toLowerCase() as "breakfast" | "lunch"
                              ].toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                              Delivery Time
                            </span>
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
                      {costs.breakfast > 0 || costs.lunch > 0 ? (
                        <button
                          className="w-full py-3 mt-2 bg-[#1A3C34] text-white rounded-lg"
                          onClick={() => setIsActivateModalOpen(true)}
                        >
                          Proceed to Activate
                        </button>
                      ) : null}
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <p className="text-center text-red-500 py-4">{error}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Activate Schedule Modal */}
      <ActivateScheduleModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        onBack={() => setIsActivateModalOpen(false)}
        mealPlan={mealPlan}
        costs={costs}
        deliveryFees={deliveryFees}
        deliveryAddress={deliveryAddress}
        startDate={startDate?.toISOString() || ""}
      />
    </>
  );
};

export default WeeklyMealPlanModal;
