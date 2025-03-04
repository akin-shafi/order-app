// components/address/AddressInput.tsx
"use client";

import { MapPin } from "lucide-react";

type AddressInputProps = {
  address: string;
  setAddress: (address: string) => void;
  setError: (error: string | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;
};

export function AddressInput({
  address,
  setAddress,
  setError,
  setIsModalOpen,
}: AddressInputProps) {
  return (
    <div className="flex-1 flex items-center bg-white rounded-full pl-2">
      <MapPin className="text-[#f15736] h-5 w-5 mr-2" />
      <input
        type="text"
        placeholder="What is your address?"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          setError(null);
        }}
        onFocus={() => setIsModalOpen(true)}
        className="bg-white rounded-full border-none outline-none w-full py-2 text-sm text-black placeholder-black"
        style={{ fontFamily: "inherit", fontSize: "inherit" }}
      />
    </div>
  );
}
