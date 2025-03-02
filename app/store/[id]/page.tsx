import Image from "next/image";
import Link from "next/link";
import HeaderStore from "@/components/HeaderStore";
import FooterStore from "@/components/FooterStore";

import {
  ArrowLeft,
  //   MapPin,
  Plus,
  //   Search,
  //   ShoppingBag,
  //   User,
} from "lucide-react";

// Sample restaurant data
const restaurant = {
  id: "iya-sharafa",
  name: "Iya Sharafa Bead and Bread",
  image: "/images/food.png?height=200&width=300",
  deliveryTime: "11min - 20min",
  rating: "4.5",
  reviews: "62",
  openingTime: "9am - 12pm",
};

// Sample categories
const categories = [
  { id: "all", name: "All", active: false },
  { id: "combo", name: "COMBO", active: true },
  { id: "beans", name: "BEANS", active: false },
  { id: "spaghetti", name: "SPAGHETTI", active: false },
  { id: "spaghetti-2", name: "SPAGHETTI", active: false },
  { id: "spaghetti-3", name: "SPAGHETTI", active: false },
];

// Sample menu items
const menuItems = [
  {
    id: "crispy-beans-1",
    name: "Favorite Crispy Beans",
    description: "Oil Beans + Plantain",
    price: "₦2,500",
    image: "/images/food.png?height=200&width=300",
  },
  {
    id: "crispy-beans-2",
    name: "Favorite Crispy Beans",
    description: "Oil Beans + Plantain",
    price: "₦2,500",
    image: "/images/food.png?height=200&width=300",
  },
  {
    id: "spicy-fish-1",
    name: "Spicy Grilled Fish",
    description: "Marinated Tilapia + Mixed Veggies",
    price: "₦3,000",
    image: "/images/food.png?height=200&width=300",
  },
  {
    id: "spicy-fish-2",
    name: "Spicy Grilled Fish",
    description: "Marinated Tilapia + Mixed Veggies",
    price: "₦3,000",
    image: "/images/food.png?height=200&width=300",
  },
  {
    id: "fried-rice-1",
    name: "Savory Fried Rice",
    description: "Jollof Rice + Chicken",
    price: "₦2,800",
    image: "/images/food.png?height=200&width=300",
  },
  {
    id: "fried-rice-2",
    name: "Savory Fried Rice",
    description: "Jollof Rice + Chicken",
    price: "₦2,800",
    image: "/images/food.png?height=200&width=300",
  },
];

export default function RestaurantPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <HeaderStore />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Restaurant details and menu */}
          <div className="w-full md:w-2/3">
            {/* Back navigation */}
            <Link
              href="/store"
              className="inline-flex items-center text-gray-600 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Restaurant
            </Link>

            {/* Restaurant info */}
            <div className="flex items-start gap-4 mb-8">
              <Image
                src={restaurant.image || "/placeholder.svg"}
                alt={restaurant.name}
                width={180}
                height={120}
                className="rounded-md object-cover"
              />

              <div>
                <div className="flex items-center text-gray-500 text-sm mb-1">
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

                <h1 className="text-2xl font-bold mb-1">{restaurant.name}</h1>

                <div className="flex items-center mb-2">
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

                <div className="text-sm text-gray-600">
                  Opening Time:{" "}
                  <span className="font-medium">{restaurant.openingTime}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Categories</h2>

              <div className="flex overflow-x-auto pb-2 -mx-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 mx-1 rounded-md text-sm whitespace-nowrap transition-colors
                      ${
                        category.active
                          ? "bg-[#461914] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div className="h-full w-1/4 bg-[#461914] rounded-full"></div>
              </div>
            </div>

            {/* Menu items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 group">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={120}
                    height={80}
                    className="rounded-md object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{item.price}</span>
                      <button className="p-1.5 rounded-md bg-white text-[#461914] border border-[#461914] hover:bg-[#461914] hover:text-white transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Cart */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0">
            <div className="bg-white border border-gray-100 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-center mb-4">
                Your cart is empty. Add items to get started
              </h2>

              <div className="flex justify-center mb-6">
                <Image
                  src="/images/takeaway.png?height=150&width=200"
                  alt="Empty cart"
                  width={200}
                  height={150}
                  className="opacity-80"
                />
              </div>

              <p className="text-center text-gray-500 text-sm">
                You&apos;ve not added any products yet. When you do, you&apos;ll
                see them here!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <FooterStore />
    </div>
  );
}
