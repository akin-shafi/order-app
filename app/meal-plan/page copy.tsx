// src/pages/meal-plan.tsx
"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMealPlan } from "@/hooks/useMealPlan";
import { useAddressAutocomplete } from "@/hooks/useAddressAutocomplete";
// import { getAuthToken } from "@/utils/auth";

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

const MealPlanPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"Breakfast" | "Lunch">(
    "Breakfast"
  );
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
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
  const [selectedPlans, setSelectedPlans] = useState<{
    breakfast: boolean;
    lunch: boolean;
  }>({ breakfast: false, lunch: false });
  const [numberOfPlates, setNumberOfPlates] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<
    "wallet" | "online" | null
  >(null);

  const {
    generateMealPlan,
    calculateCost,
    activateSchedule,
    saveMealPlan,
    loading,
    error,
  } = useMealPlan();
  const {
    input,
    setInput,
    suggestions,
    loading: addressLoading,
    error: addressError,
  } = useAddressAutocomplete();

  // Authentication check
//   useEffect(() => {
//     const token = getAuthToken();
//     if (!token) {
//       router.push("/login");
//     }
//   }, [router]);

  const handleGenerateMealPlan = async () => {
    if (!startDate || !endDate || !deliveryAddress) return;
    const response = await generateMealPlan({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      deliveryAddress,
    });
    if (response) {
      setMealPlan(response.mealPlan);
      setStep(2);
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
    if (!mealPlan || !mealPlan[type] || !mealPlan[type][index]) return;
    const newMeal = {
      name: `New ${type} Meal`,
      description: "Swapped meal",
      price: 1200,
    };
    const updatedPlan: MealPlan = {
      breakfast: [...mealPlan.breakfast],
      lunch: [...mealPlan.lunch],
    };
    updatedPlan[type][index] = { ...updatedPlan[type][index], meal: newMeal };
    setMealPlan(updatedPlan);
    if (costs[type] > 0) handleCalculateCost(type);
  };

  const handleSaveForLater = async () => {
    if (!mealPlan || !startDate || !endDate || !deliveryAddress) return;
    const response = await saveMealPlan({
      mealPlan,
      totalCost: costs,
      deliveryFees,
      deliveryAddress,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    if (response) {
    //   resetFields();
    //   router.push("/profile");
    }
  };

  const handleActivate = async () => {
    if (!selectedPlans.breakfast && !selectedPlans.lunch) return;

    // Explicitly type the baseTotalCost as a number
    const baseTotalCost: number =
      (selectedPlans.breakfast ? costs.breakfast + deliveryFees.breakfast : 0) +
      (selectedPlans.lunch ? costs.lunch + deliveryFees.lunch : 0);

    const totalCost: number = baseTotalCost * numberOfPlates;

    const response = await activateSchedule({
      mealPlan: {
        breakfast: selectedPlans.breakfast ? mealPlan!.breakfast : [],
        lunch: selectedPlans.lunch ? mealPlan!.lunch : [],
      },
      totalCost,
      deliveryAddress,
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
      paymentMethod: paymentMethod || "wallet",
      numberOfPlates,
    });

    if (response) {
      resetFields();
      // router.push("/profile");
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

  const getDaysBetweenDates = (start: Date, end: Date) => {
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getWeekDates = (start: Date, end: Date) => {
    const dates: { date: string; day: string }[] = [];
    const days = getDaysBetweenDates(start, end);
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        day: formatDate(date),
      });
    }
    return dates;
  };

  const weekDates =
    startDate && endDate ? getWeekDates(startDate, endDate) : [];
  console.log("weekDates", weekDates);
  const handleSelectAddress = (suggestion: {
    description: string;
    details: { formattedAddress: string } | null;
  }) => {
    const address =
      suggestion.details?.formattedAddress || suggestion.description;
    setDeliveryAddress(address);
    setInput(address);
    setIsAddressFormOpen(false);
  };

  const resetFields = () => {
    setStep(1);
    setStartDate(new Date());
    setEndDate(null);
    setDeliveryAddress("");
    setInput("");
    setMealPlan(null);
    setCosts({ breakfast: 0, lunch: 0 });
    setDeliveryFees({ breakfast: 0, lunch: 0 });
    setSelectedPlans({ breakfast: false, lunch: false });
    setNumberOfPlates(1);
    setPaymentMethod(null);
    setIsAddressFormOpen(false);
    setIsStartDatePickerOpen(false);
    setIsEndDatePickerOpen(false);
  };

  const getMinEndDate = () => {
    if (!startDate) return new Date();
    const minEnd = new Date(startDate);
    minEnd.setDate(startDate.getDate() + 2);
    return minEnd;
  };

  return (
    <>
      <div className="relative z-10">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-12 pt-32">
          {/* Introduction Section */}
          <div className="p-4 bg-[#FF6600]/10 border-b border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-[#1A3C34] mb-2">
              Your Perfect Weekly Meal Plan Awaits! 🍽️
            </h3>
            <p className="text-sm text-[#292d32]">
              Say goodbye to meal planning stress! With our Weekly Meal Plan,
              you get a delicious, hassle-free menu for breakfast and lunch,
              tailored just for you. Pick your start date, set your delivery
              address, and we’ll deliver fresh meals straight to your
              door—saving you time and effort. Customize, save for later, or
              activate your plan today!
            </p>
          </div>
          <div className="min-h-screen bg-gray-100 p-4">
            {/* Step Indicator */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center">
                {["Plan Setup", "Meal Selection", "Summary & Activation"].map(
                  (label, index) => (
                    <div key={index} className="flex-1 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step >= index + 1
                              ? "bg-[#FF6600] text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < 2 && (
                          <div
                            className={`flex-1 h-1 mx-2 ${
                              step > index + 1 ? "bg-[#FF6600]" : "bg-gray-300"
                            }`}
                          />
                        )}
                      </div>
                      <p className="text-sm mt-2 text-[#292d32]">{label}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
              {/* Step 1: Plan Setup */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#292d32] mb-4">
                    Set Up Your Meal Plan
                  </h2>

                  {/* Start Date */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#292d32]">
                        Start Date
                      </span>
                      <button
                        className="flex items-center gap-2 text-[#FF6600]"
                        onClick={() => setIsStartDatePickerOpen(true)}
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
                    {isStartDatePickerOpen && (
                      <div className="mt-2">
                        <DatePicker
                          selected={startDate}
                          onChange={(date: Date | null) => {
                            if (date) {
                              setStartDate(date);
                              if (endDate && date) {
                                const minEnd = new Date(date);
                                minEnd.setDate(date.getDate() + 2);
                                if (endDate < minEnd) setEndDate(null);
                              }
                            }
                            setIsStartDatePickerOpen(false);
                          }}
                          minDate={new Date()}
                          inline
                          onClickOutside={() => setIsStartDatePickerOpen(false)}
                        />
                      </div>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#292d32]">
                        End Date
                      </span>
                      <button
                        className="flex items-center gap-2 text-[#FF6600]"
                        onClick={() => setIsEndDatePickerOpen(true)}
                      >
                        <Calendar size={20} />
                        <span>{endDate ? "Change Date" : "Select Date"}</span>
                      </button>
                    </div>
                    {endDate && (
                      <p className="mt-2 text-sm text-[#292d32]">
                        {formatDate(endDate)}
                      </p>
                    )}
                    {isEndDatePickerOpen && (
                      <div className="mt-2">
                        <DatePicker
                          selected={endDate}
                          onChange={(date: Date | null) => {
                            if (date) setEndDate(date);
                            setIsEndDatePickerOpen(false);
                          }}
                          minDate={getMinEndDate()}
                          inline
                          onClickOutside={() => setIsEndDatePickerOpen(false)}
                        />
                      </div>
                    )}
                    {startDate && !endDate && (
                      <p className="mt-2 text-sm text-gray-500">
                        Please select an end date (minimum 3 days from start
                        date).
                      </p>
                    )}
                  </div>

                  {/* Delivery Address */}
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
                        />
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
                            if (!deliveryAddress && input)
                              setDeliveryAddress(input);
                            setIsAddressFormOpen(false);
                          }}
                          disabled={!input}
                        >
                          Save Address
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-3 bg-gray-500 text-white rounded-lg"
                      onClick={() => router.push("/profile")}
                    >
                      Cancel
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg text-white ${
                        startDate && endDate && deliveryAddress
                          ? "bg-[#FF6600]"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      onClick={handleGenerateMealPlan}
                      disabled={
                        !startDate || !endDate || !deliveryAddress || loading
                      }
                    >
                      {loading ? "Generating..." : "Next"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Meal Selection */}
              {step === 2 && (
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
                                <p className="font-medium">
                                  {dailyMeal.meal.name}
                                </p>
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
                      disabled={
                        !(costs.breakfast > 0 || costs.lunch > 0) || loading
                      }
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Summary & Activation */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#292d32] mb-4">
                    Summary & Activation
                  </h2>

                  {/* Select Plans */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                      Select Meal Plans
                    </h3>
                    {costs.breakfast > 0 && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedPlans.breakfast}
                          onChange={() =>
                            setSelectedPlans((prev) => ({
                              ...prev,
                              breakfast: !prev.breakfast,
                            }))
                          }
                        />
                        <span className="text-sm text-[#292d32]">
                          Breakfast (₦
                          {(
                            costs.breakfast + deliveryFees.breakfast
                          ).toLocaleString()}
                          )
                        </span>
                      </label>
                    )}
                    {costs.lunch > 0 && (
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={selectedPlans.lunch}
                          onChange={() =>
                            setSelectedPlans((prev) => ({
                              ...prev,
                              lunch: !prev.lunch,
                            }))
                          }
                        />
                        <span className="text-sm text-[#292d32]">
                          Lunch (₦
                          {(costs.lunch + deliveryFees.lunch).toLocaleString()})
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Number of Plates */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                      Number of Plates
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                        onClick={() =>
                          setNumberOfPlates((prev) => Math.max(1, prev - 1))
                        }
                        disabled={numberOfPlates <= 1}
                      >
                        -
                      </button>
                      <span className="text-sm text-[#292d32]">
                        {numberOfPlates}
                      </span>
                      <button
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                        onClick={() => setNumberOfPlates((prev) => prev + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                      Summary
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Total Cost (for 1 plate)
                      </span>
                      <span className="text-sm text-[#292d32]">
                        ₦
                        {(
                          (selectedPlans.breakfast
                            ? costs.breakfast + deliveryFees.breakfast
                            : 0) +
                          (selectedPlans.lunch
                            ? costs.lunch + deliveryFees.lunch
                            : 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Number of Plates
                      </span>
                      <span className="text-sm text-[#292d32]">
                        {numberOfPlates}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-[#292d32]">
                        Total Cost
                      </span>
                      <span className="text-sm font-semibold text-[#292d32]">
                        ₦
                        {(
                          ((selectedPlans.breakfast
                            ? costs.breakfast + deliveryFees.breakfast
                            : 0) +
                            (selectedPlans.lunch
                              ? costs.lunch + deliveryFees.lunch
                              : 0)) *
                          numberOfPlates
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        Delivery Address
                      </span>
                      <span className="text-sm text-[#292d32]">
                        {deliveryAddress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Date Range</span>
                      <span className="text-sm text-[#292d32]">
                        {startDate?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        -
                        {endDate?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {selectedPlans.breakfast && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                          Breakfast Delivery Time
                        </span>
                        <span className="text-sm text-[#292d32]">
                          8:00 AM - 11:00 AM
                        </span>
                      </div>
                    )}
                    {selectedPlans.lunch && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">
                          Lunch Delivery Time
                        </span>
                        <span className="text-sm text-[#292d32]">
                          12:00 PM - 3:00 PM
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#292d32] mb-2">
                      Payment Method
                    </h3>
                    <button
                      className={`w-full py-2 mb-2 rounded-lg ${
                        paymentMethod === "wallet"
                          ? "bg-[#FF6600] text-white"
                          : "bg-gray-100 text-[#292d32]"
                      }`}
                      onClick={() => setPaymentMethod("wallet")}
                    >
                      Pay with Wallet
                    </button>
                    <button
                      className={`w-full py-2 rounded-lg ${
                        paymentMethod === "online"
                          ? "bg-[#FF6600] text-white"
                          : "bg-gray-100 text-[#292d32]"
                      }`}
                      onClick={() => setPaymentMethod("online")}
                    >
                      Pay Online
                    </button>
                    {paymentMethod === "online" && (
                      <div className="mt-4 space-y-2">
                        <input
                          type="text"
                          placeholder="Card Number"
                          className="w-full p-2 border border-gray-200 rounded-lg"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Expiry (MM/YY)"
                            className="w-1/2 p-2 border border-gray-200 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="CVV"
                            className="w-1/2 p-2 border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-3 bg-gray-500 text-white rounded-lg"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </button>
                    <button
                      className="flex-1 py-3 bg-gray-500 text-white rounded-lg"
                      onClick={handleSaveForLater}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save for Later"}
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg text-white ${
                        (selectedPlans.breakfast || selectedPlans.lunch) &&
                        paymentMethod
                          ? "bg-[#FF6600]"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      onClick={handleActivate}
                      disabled={
                        !(selectedPlans.breakfast || selectedPlans.lunch) ||
                        !paymentMethod ||
                        loading
                      }
                    >
                      {loading ? "Activating..." : "Confirm Payment"}
                    </button>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <p className="text-center text-red-500 py-4">{error}</p>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MealPlanPage;
