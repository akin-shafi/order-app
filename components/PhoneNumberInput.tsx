"use client";

import React from "react";
import Image from "next/image";

interface Props {
  phoneNo: string;
  onFocus?: () => void;
  setPhoneNo: (value: string) => void;
}

export default function PhoneNumberInput({
  phoneNo,
  onFocus,
  setPhoneNo,
}: Props) {
  const handleChange = (e: { target: { value: string } }) => {
    let value = e.target.value.trim();
    // Remove non-digits except the leading +
    const cleanedValue = value.replace(/[^+\d]/g, "");

    // Handle local format (e.g., "08098290445") or international (e.g., "+2348098290445")
    if (cleanedValue.startsWith("0") && !cleanedValue.startsWith("+")) {
      value = "+234" + cleanedValue.slice(1); // Convert local to international
    } else if (!cleanedValue.startsWith("+234") && cleanedValue.length > 0) {
      value = "+234" + cleanedValue; // Prepend +234 if missing
    } else {
      value = cleanedValue; // Keep as is if it starts with +234
    }

    // Limit to 13 characters (+234 and 10 digits)
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    console.log("Phone number changed:", value);
    setPhoneNo(value);
  };

  const handleBlur = () => {
    // Validation: Check if it's a valid Nigerian number
    if (phoneNo && !/^\+234\d{10}$/.test(phoneNo)) {
      console.warn("Invalid Nigerian phone number:", phoneNo);
    }
  };

  return (
    <div className="flex items-center w-full border border-gray-300 rounded-md h-[38px] overflow-hidden">
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
        value={phoneNo}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={handleBlur}
        placeholder="8098290445"
        className="flex-1 h-full p-2 text-black focus:outline-none focus:ring-1 focus:ring-[#1A2E20] rounded-r-md"
        maxLength={13} // +234 and 10 digits
      />
    </div>
  );
}
