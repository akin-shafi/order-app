// components/BusinessInfoSection.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BusinessDetails = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  deliveryOptions: string[]; // Corrected property name
  image: string | null;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  rating: string;
  totalRatings: number;
  isActive: boolean;
};

interface BusinessInfoSectionProps {
  business: BusinessDetails;
  isLoading?: boolean;
}

export default function BusinessInfoSection({
  business,
  isLoading = false,
}: BusinessInfoSectionProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="inline-flex items-center mb-6">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2 animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="w-full h-64 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="flex items-center mb-1">
              <div className="h-4 w-4 bg-gray-200 rounded mr-1 animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-8 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="flex items-center mb-2">
              <div className="h-4 w-4 bg-gray-200 rounded mr-1 animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link
        href="/store"
        className="inline-flex items-center text-gray-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Business
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-8">
        <div className="col-span-1 lg:col-span-2">
          <Image
            src={business.image || "/images/food.png"}
            alt={business.name}
            width={256}
            height={256}
            className="rounded-md object-cover w-full h-full"
          />
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="flex flex-col items-start text-gray-500 text-sm mb-1">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Delivery Options: {business.deliveryOptions.join(", ")}
          </div>
          <h1 className="text-2xl font-bold mb-1 text-[#292d32]">
            {business.name}
          </h1>
          <div className="flex items-center mb-2">
            <svg
              className="w-4 h-4 text-yellow-400 fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-sm ml-1 text-[#292d32]">
              {business.rating} ({business.totalRatings} reviews)
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Opening Time:{" "}
            <span className="font-medium">{business.openingTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
