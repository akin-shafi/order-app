/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart } from "lucide-react";
import { useAddress } from "@/contexts/address-context";
import { useBusiness } from "@/hooks/useBusiness";

interface Business {
  id: string;
  name: string;
  image: string;
  city: string;
  categories: string[];
  priceRange: string | null;
  deliveryTimeRange: string | null;
  rating: string;
  ratingCount: number;
}

const SkeletonCard = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-gray-100 animate-pulse">
    <div className="w-full h-40 bg-gray-200" />
    <div className="p-3">
      <div className="flex items-center justify-between mb-1">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center">
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>
      </div>
      <div className="flex items-center text-gray-500 text-xs">
        <div className="h-3 w-3 bg-gray-200 rounded mr-1" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="flex flex-wrap gap-3 mt-2">
        <div className="h-3 bg-gray-200 rounded w-12" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

export default function FeaturedStore({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) {
  const { address, locationDetails } = useAddress();
  const { businesses, loading, error } = useBusiness({
    address,
    localGovernment: locationDetails?.localGovernment,
    state: locationDetails?.state,
    category: selectedCategory || undefined,
  });

  const filteredBusinesses = businesses;

  const handleHeartClick = (e: React.MouseEvent, businessId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Heart clicked for business: ${businessId}`);
  };

  // console.log("FeaturedStore - Filtered businesses:", filteredBusinesses);

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#000000] mb-2 flex items-center">
        Featured Businesses
      </h2>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center text-center my-4">
          <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
            <Image
              src="/icons/empty_box.png"
              alt="No businesses"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">
            {error === "Waiting for location data..."
              ? "Fetching your location..."
              : "Error loading businesses"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {error === "Waiting for location data..."
              ? "Please wait while we get your location."
              : "Please try again or set your location manually."}
          </p>
        </div>
      )}

      {!loading && !error && filteredBusinesses.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center my-4">
          <div className="relative w-32 h-30 mb-6 rounded bg-gray-100 flex items-center justify-center">
            <Image
              src="/icons/empty_box.png"
              alt="Delivery unavailable"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h3 className=" font-bold text-md text-black mb-2">
            No businesses found for this location or category
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Click the address field above to enter new location
          </p>
        </div>
      )}

      {!loading && filteredBusinesses.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow relative"
            >
              <Link href={`/store/id=${business.id}`} className="block">
                <div className="relative hover-container">
                  <Image
                    src={business.image || "/placeholder.svg"}
                    alt={business.name}
                    width={280}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 overlay transition-opacity duration-300 ease-in-out"></div>
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-[#292d32] text-base mb-0 text-truncate hover:underline truncate-text-300">
                      {business.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-xs mr-1 text-[#292d32]">
                        {business.rating}({business.ratingCount})
                      </span>
                      <StarIcon className="text-yellow-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-xs">
                    <ClockIcon className="text-[#FF6600] mr-1 w-4 h-4" />
                    {business.deliveryTimeRange || "N/A"}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-1">
                    {business.categories.map((category, index) => (
                      <span
                        key={index}
                        className="text-[#FF6600] text-xs py-0.5 rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => handleHeartClick(e, business.id)}
                className="absolute top-2 right-2 bg-white hover:bg-gray-200 cursor-pointer p-1 rounded-full z-10"
              >
                <Heart className="h-4 w-4 text-red-400 hover:text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredBusinesses.length > 0 && (
        <div className="flex justify-center mt-6">
          <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm">
            View More
          </button>
        </div>
      )}
    </section>
  );
}
