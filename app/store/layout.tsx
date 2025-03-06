// app/store/layout.tsx
import { Suspense } from "react";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
          <div className="flex flex-col items-center gap-4">
            {/* Fancy Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-t-4 border-gray-200 border-t-[#f15736] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-t-4 border-gray-300 border-t-[#d8432c] rounded-full animate-spin animate-reverse"></div>
            </div>
            {/* Loading Text with Pulse */}
            <span className="text-lg font-semibold text-gray-800 animate-pulse">
              Loading your store...
            </span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
