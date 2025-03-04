/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon, StarIcon } from "@/components/icons";
import { Heart } from "lucide-react";
import { useAddress } from "@/contexts/address-context"; // Import address context

interface Restaurant {
  id: string;
  name: string;
  image: string;
  deliveryTime: string;
  rating: string;
  reviews: string;
  tags: string[];
}

export default function FeaturedStore() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAddress(); // Fetch address from context

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!address) {
        // Use static data as fallback if no address
        setRestaurants(
          Array(6).fill({
            id: "static",
            name: "Iya Sharafa Bead and Bread",
            image: "/images/beans-and-bread.png?height=200&width=300",
            deliveryTime: "11min - 20min",
            rating: "4.5",
            reviews: "62",
            tags: ["RESTAURANT", "BETA MART"],
          })
        );
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
        // Fallback to static data on error
        setRestaurants(
          Array(6).fill({
            id: "static",
            name: "Iya Sharafa Bead and Bread",
            image: "/images/beans-and-bread.png?height=200&width=300",
            deliveryTime: "11min - 20min",
            rating: "4.5",
            reviews: "62",
            tags: ["RESTAURANT", "BETA MART"],
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [address]); // Re-fetch when address changes

  return (
    <section>
      <h2 className="text-2xl font-medium text-[#292d32] mb-6 mt-6">
        Featured Restaurants
      </h2>

      {loading && <div className="text-center">Loading restaurants...</div>}

      {error && !loading && (
        <div className="text-center text-red-500 mb-4">{error}</div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.id || index} // Use id if available, index as fallback
              className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="relative hover-container">
                <Image
                  src={restaurant.image || "/placeholder.svg"}
                  alt={restaurant.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50 overlay"></div>
                <button className="absolute top-3 right-3 bg-white hover:bg-gray-200 cursor-pointer p-1.5 rounded-full">
                  <Heart className="h-5 w-5 text-red-400 hover:text-gray-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <Link href={`/store/id=${restaurant.id || index + 1}`}>
                    <h3 className="font-medium text-[#292d32] text-lg mb-0 text-truncate hover:underline truncate-text-300">
                      {restaurant.name}
                    </h3>
                  </Link>
                  <div className="flex items-center">
                    <span className="text-sm mr-1 text-[#292d32]">
                      {restaurant.rating}({restaurant.reviews})
                    </span>
                    <StarIcon className="text-yellow-400" />
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm">
                  <ClockIcon className="text-[#FF6600] mr-1" />
                  {restaurant.deliveryTime}
                </div>

                <div className="flex flex-wrap gap-4">
                  {restaurant.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-[#FF6600] text-xs py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
          View More
        </button>
      </div>
    </section>
  );
}
