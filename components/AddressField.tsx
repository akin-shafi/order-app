import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function AddressField() {
  return (
    <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:bg-white p-1 rounded-full max-w-md mx-auto md:mx-0 animate-fadeInUp">
      <div className="flex-1 flex items-center bg-white rounded-full pl-2 ">
        <MapPin className="text-[#f15736] h-5 w-5 mr-2" />
        <input
          type="text"
          placeholder="What is your address?"
          className="bg-transparent border-none outline-none w-full py-2 text-sm"
        />
      </div>
      <button className="bg-[#f15736] text-white rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors">
        <Navigation className="h-4 w-4 mr-2" />
        Use current location
      </button>
    </div>
  );
}
