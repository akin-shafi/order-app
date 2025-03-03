import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";
import CategoriesInStore from "@/components/CategoriesInStore";
import { ClockIcon, StarIcon } from "@/components/icons";

// Sample data for restaurants
const restaurants = Array(6).fill({
  name: "Iya Sharafa Bead and Bread",
  image: "/images/beans-and-bread.png?height=200&width=300",
  deliveryTime: "11min - 20min",
  rating: "4.5",
  reviews: "62",
  tags: ["RESTAURANT", "BETA MART"],
});

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderStore />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories Section */}
        <CategoriesInStore />

        {/* Restaurants Section */}
        <section>
          <h2 className="text-2xl font-medium text-[#292d32] mb-6 mt-6">
            Featured Restaurants
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={index}
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
                    <Link href={`/store/id=${index + 1}`}>
                      <h3 className="font-medium  text-[#292d32] text-lg mb-0 text-truncate hover:underline truncate-text-300">
                        {restaurant.name}
                      </h3>
                    </Link>
                    <div className="flex items-center">
                      <span className="text-sm mr-1">
                        {restaurant.rating}({restaurant.reviews})
                      </span>
                      <StarIcon className="text-yellow-400" />
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm">
                    <ClockIcon className="text-orange-600 mr-1" />

                    {restaurant.deliveryTime}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {restaurant.tags.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="text-orange-600 text-xs  py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors">
              View More
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterStore />
    </div>
  );
}
