import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { categories } from "@/data/content";
import HeaderStore from "@/components/HeaderStore";
import FeaturesStoreSection from "@/components/FooterStore";
// Sample data for restaurants
const restaurants = Array(6).fill({
  name: "Iya Sharafa Bead and Bread",
  image: "/images/beans-and-bread.png?height=200&width=300",
  deliveryTime: "11min - 20min",
  rating: "4.5",
  reviews: "62",
  tags: ["BEAN COMBO", "BEAN COMBO"],
});

export default function StorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderStore />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#292d32]">
              Explore Categories
            </h2>
            <Link
              href="#"
              className="bg-[#210603] text-white px-4 py-2 rounded text-sm"
            >
              See more
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`bg-gray-50 p-4 rounded-lg flex flex-col items-center cursor-pointer transition-all hover:shadow-md
                  ${index === 2 ? "ring-2 ring-[#461914]" : ""}
                `}
              >
                <div className="w-16 h-16 mb-2">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <span className="text-[#292d32] font-medium text-sm text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Restaurants Section */}
        <section>
          <h2 className="text-2xl font-bold text-[#292d32] mb-6">
            All Restaurants
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full">
                    <Heart className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
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
                        ></path>
                      </svg>
                      {restaurant.deliveryTime}
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="text-sm ml-1">
                        {restaurant.rating}({restaurant.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
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
      <FeaturesStoreSection />
    </div>
  );
}
