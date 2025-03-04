// components/address/LocationButton.tsx
import { Navigation } from "lucide-react";

type LocationButtonProps = {
  isLoading: boolean;
  onGetLocation: () => void;
  address: string;
};

export function LocationButton({
  isLoading,
  onGetLocation,
  address,
}: LocationButtonProps) {
  if (address) return null;

  return (
    <button
      onClick={onGetLocation}
      disabled={isLoading}
      className="bg-[#f15736] text-white cursor-pointer rounded-full px-4 py-2 flex items-center justify-center text-sm hover:bg-[#d8432c] transition-colors disabled:opacity-70"
    >
      <Navigation className="h-4 w-4 mr-2" />
      Use current location
    </button>
  );
}
