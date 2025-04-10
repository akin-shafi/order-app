import React, { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PlanSetupProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  input: string;
  setInput: (input: string) => void;
  suggestions: {
    description: string;
    details: { formattedAddress: string } | null;
  }[];
  addressLoading: boolean;
  addressError: string | null;
  handleGenerateMealPlan: () => Promise<void>;
  loading: boolean;
  router: { push: (path: string) => void }; // Minimal type for the router prop
}

const PlanSetup: React.FC<PlanSetupProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  deliveryAddress,
  setDeliveryAddress,
  input,
  setInput,
  suggestions,
  addressLoading,
  addressError,
  handleGenerateMealPlan,
  loading,
  router,
}) => {
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMinEndDate = () => {
    if (!startDate) return new Date();
    const minEnd = new Date(startDate);
    minEnd.setDate(startDate.getDate() + 2);
    return minEnd;
  };

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

  return (
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
          <p className="mt-2 text-sm text-[#292d32]">{formatDate(startDate)}</p>
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
          <span className="text-sm font-semibold text-[#292d32]">End Date</span>
          <button
            className="flex items-center gap-2 text-[#FF6600]"
            onClick={() => setIsEndDatePickerOpen(true)}
          >
            <Calendar size={20} />
            <span>{endDate ? "Change Date" : "Select Date"}</span>
          </button>
        </div>
        {endDate && (
          <p className="mt-2 text-sm text-[#292d32]">{formatDate(endDate)}</p>
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
            Please select an end date (minimum 3 days from start date).
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
            <span>{deliveryAddress ? "Change Address" : "Add Address"}</span>
          </button>
        </div>
        {deliveryAddress && (
          <p className="mt-2 text-sm text-[#292d32]">{deliveryAddress}</p>
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
              <p className="text-sm text-red-500 mt-2">{addressError}</p>
            )}
            <button
              className="w-full py-2 bg-[#FF6600] text-white rounded-lg"
              onClick={() => {
                if (!deliveryAddress && input) setDeliveryAddress(input);
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
          onClick={() => router.push("/store")}
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
          disabled={!startDate || !endDate || !deliveryAddress || loading}
        >
          {loading ? "Generating..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default PlanSetup;
