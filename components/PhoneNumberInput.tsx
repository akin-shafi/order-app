"use client";

import React, { forwardRef } from "react";
import Image from "next/image";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: (value: string) => void;
  hasError?: boolean;
  autoFocus?: boolean; // Added autoFocus prop
}

const PhoneNumberInput = forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  (
    { value, onChange, onFocus, onBlur, hasError = false, autoFocus = false },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.trim();
      const cleanedValue = inputValue.replace(/[^+\d]/g, "");

      let newValue = cleanedValue;
      if (cleanedValue.startsWith("0") && !cleanedValue.startsWith("+")) {
        newValue = "234" + cleanedValue.slice(1);
      } else if (!cleanedValue.startsWith("234") && cleanedValue.length > 0) {
        newValue = "234" + cleanedValue;
      }

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
        <div className="flex items-center bg-gray-100 border-r border-gray-300 px-2 h-full">
          <Image
            src="/flags/ng.png"
            alt="Nigeria Flag"
            width={24}
            height={16}
            className="mr-1"
          />
          <span className="text-black font-medium">+234</span>
        </div>
        <input
          ref={ref} // Added ref prop
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={handleBlurEvent}
          autoFocus={autoFocus} // Added autoFocus prop
          placeholder="8098290445"
          className={`flex-1 h-full p-2 text-black focus:outline-none focus:ring-1 focus:ring-[#000000] rounded-r-md ${
            hasError ? "border-red-500" : ""
          }`}
          maxLength={13}
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
