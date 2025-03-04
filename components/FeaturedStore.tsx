/* eslint-disable @typescript-eslint/no-unused-vars */
// FeaturedStore.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart } from "lucide-react";
import { useAddress } from "@/contexts/address-context";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  deliveryTime: string;
  rating: string;
  reviews: string;
  tags: string[];
  category: string; // Added category field
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAddress();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const staticData = Array(6).fill({
        id: "static",
        name: "Iya Sharafa Bead and Bread",
        image: "/images/beans-and-bread.png?height=200&width=300",
        deliveryTime: "11min - 20min",
        rating: "4.5",
        reviews: "62",
        tags: ["RESTAURANT", "BETA MART"],
        category: "Food",
      });

      if (!address) {
        setRestaurants(staticData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/restaurants?address=${encodeURIComponent(address)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError("Error loading featured restaurants");
        setRestaurants(staticData);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [address]);

  const filteredRestaurants = selectedCategory
    ? restaurants.filter(
        (r) => r.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : restaurants;

  const handleHeartClick = (e: React.MouseEvent, restaurantId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Heart clicked for restaurant: ${restaurantId}`);
  };

  return (
    <section>
      <h2 className="text-xl font-medium text-[#292d32] mb-6 mt-6">
        Featured Restaurants
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
        <div className="text-center text-red-500 mb-4">{error}</div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant, index) => (
            <div
              key={restaurant.id || index}
              className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow relative"
            >
              <Link
                href={`/store/id=${restaurant.id || index + 1}`}
                className="block"
              >
                <div className="relative hover-container">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={280}
                    height={180}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 overlay transition-opacity duration-300 ease-in-out"></div>
                </div>

                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-[#292d32] text-base mb-0 text-truncate hover:underline truncate-text-300">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-xs mr-1 text-[#292d32]">
                        {restaurant.rating}({restaurant.reviews})
                      </span>
                      <StarIcon className="text-yellow-400 w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-xs">
                    <ClockIcon className="text-[#FF6600] mr-1 w-4 h-4" />
                    {restaurant.deliveryTime}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-1">
                    {restaurant.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-[#FF6600] text-xs py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) =>
                  handleHeartClick(e, restaurant.id || `${index}`)
                }
                className="absolute top-2 right-2 bg-white hover:bg-gray-200 cursor-pointer p-1 rounded-full z-10"
              >
                <Heart className="h-4 w-4 text-red-400 hover:text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button className="border border-gray-300 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-50 transition-colors text-sm">
          View More
        </button>
      </div>
    </section>
  );
}
