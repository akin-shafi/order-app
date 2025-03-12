"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAddress } from "@/contexts/address-context";

interface RecommendedBusiness {
  id: string;
  name: string;
  image: string;
  rating: number | null;
  deliveryTime: string;
  tags: string[];
  status: string;
  preOrder?: boolean;
  businessType: string;
  productCategories: string[];
}

const SkeletonRecommendedCard = () => (
  <div className="rounded-lg animate-pulse bg-gray-100 w-64 h-80 flex-shrink-0">
    <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

export default function RecommendedForYou() {
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [recommendations, setRecommendations] = useState<RecommendedBusiness[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { address, locationDetails } = useAddress();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!address || !locationDetails) {
        setError("Location not set");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
            localGovernment: locationDetails.localGovernment,
            state: locationDetails.state,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recommendations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [address, locationDetails]);

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleItemClick = (id: string) => {
    router.push(`/store/${id}`);
  };

  return (
    <section className="py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-[#292d32] mb-3 md:mb-6 flex items-center">
            Recommended for You
            <Heart className="ml-2 h-4 md:h-5 w-4 md:w-5 text-[#ff6600]" />
          </h2>

          {error && (
            <div className="text-center py-4">
              <p className="text-red-500">{error}</p>
              <p className="text-sm text-gray-500 mt-2">
                Please set your location to see recommendations
              </p>
            </div>
          )}

          {/* Mobile: Horizontal scrolling container */}
          <div className="md:hidden">
            {loading ? (
              <div className="overflow-x-auto scrollbar-hide py-4 px-2 snap-x snap-mandatory">
                <div className="flex space-x-4 w-[calc(256px*1.25)]">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <SkeletonRecommendedCard key={index} />
                    ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-hide py-4 px-2 snap-x snap-mandatory">
                <div className="flex space-x-4 w-[calc(256px*1.25)]">
                  {recommendations.map((item) => (
                    <div
                      key={item.id}
                      className="w-64 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex-shrink-0 snap-start"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={256}
                          height={192}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-lg" />
                        <div className="absolute top-3 left-3 bg-[#000000]/90 text-white text-xs font-semibold px-2 py-1 rounded-md">
                          {item.status}
                        </div>
                        {item.preOrder && (
                          <button className="absolute bottom-3 right-3 bg-[#ff6600] text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e65c00] transition-colors">
                            Pre-order
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="absolute top-3 right-3 p-1 rounded-full bg-white/80 hover:bg-white"
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites[item.id]
                                ? "text-[#ff6600] fill-[#ff6600]"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          {item.rating ? (
                            <>
                              <span className="text-[#ff6600] text-sm mr-1">
                                ★
                              </span>
                              <span className="text-gray-700 text-sm">
                                {item.rating}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No rating
                            </span>
                          )}
                          <span className="text-gray-500 text-sm ml-2">
                            • {item.deliveryTime}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[#000000] text-xs font-medium bg-[#e6f0ea] px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => <SkeletonRecommendedCard key={index} />)
              : recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={256}
                        height={192}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-lg" />
                      <div className="absolute top-3 left-3 bg-[#000000]/90 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {item.status}
                      </div>
                      {item.preOrder && (
                        <button className="absolute bottom-3 right-3 bg-[#ff6600] text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e65c00] transition-colors">
                          Pre-order
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-3 right-3 p-1 rounded-full bg-white/80 hover:bg-white"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites[item.id]
                              ? "text-[#ff6600] fill-[#ff6600]"
                              : "text-gray-600"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        {item.rating ? (
                          <>
                            <span className="text-[#ff6600] text-sm mr-1">
                              ★
                            </span>
                            <span className="text-gray-700 text-sm">
                              {item.rating}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No rating
                          </span>
                        )}
                        <span className="text-gray-500 text-sm ml-2">
                          • {item.deliveryTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[#000000] text-xs font-medium bg-[#e6f0ea] px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
