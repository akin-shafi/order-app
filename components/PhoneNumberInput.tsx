"use client";

import React from "react";
import Image from "next/image";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: (value: string) => void;
  hasError?: boolean; // Optional prop to style based on errors
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  hasError = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    const cleanedValue = inputValue.replace(/[^+\d]/g, ""); // Remove non-digits except +

    // Handle local (e.g., "08098290445") or international (e.g., "+2348145360866")
    let newValue = cleanedValue;
    if (cleanedValue.startsWith("0") && !cleanedValue.startsWith("+")) {
      newValue = "234" + cleanedValue.slice(1); // Convert local to international
    } else if (!cleanedValue.startsWith("234") && cleanedValue.length > 0) {
      newValue = "234" + cleanedValue; // Prepend +234 if missing
    }

    // Limit to 13 characters (+234 and 10 digits)
    if (newValue.length > 13) {
      newValue = newValue.slice(0, 13);
    }

    console.log("Phone number changed:", newValue);
    onChange(newValue);
  };

  const handleBlurEvent = () => {
    if (onBlur) {
      onBlur(value);
    }
  };

  return (
    <div
      className={`flex items-center w-full border rounded-md h-[38px] overflow-hidden ${
        hasError ? "border-red-500" : "border-gray-300"
      }`}
    >
      {/* Flag and Country Code Prefix */}
      <div className="flex items-center bg-gray-100 border-r border-gray-300 px-2 h-full">
        <Image
          src="/flags/ng.png" // Nigerian flag in public/flags/ng.png
          alt="Nigeria Flag"
          width={24}
          height={16}
          className="mr-1"
        />
        <span className="text-black font-medium">+234</span>
      </div>
      {/* Phone Input */}
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={handleBlurEvent}
        placeholder="8098290445"
        className={`flex-1 h-full p-2 text-black focus:outline-none focus:ring-1 focus:ring-[#1A2E20] rounded-r-md ${
          hasError ? "border-red-500" : ""
        }`}
        maxLength={13}
      />
    </div>
  );
};

export default PhoneNumberInput;
