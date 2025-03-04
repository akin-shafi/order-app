// components/address/StatusDisplay.tsx
// import { Loader2 } from "lucide-react";

type StatusDisplayProps = {
  isLoading: boolean;
  error: string | null;
};

export function StatusDisplay({ isLoading, error }: StatusDisplayProps) {
  if (isLoading) {
    return (
      <div className="absolute left-0 right-0 text-center mt-2 flex items-center justify-center gap-2 animate-fadeIn">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-sm text-black font-bold">
          Fetching your location...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute left-0 right-0 text-center mt-2 text-red-500 text-sm animate-fadeIn">
        {error}
      </div>
    );
  }

  return null;
}
