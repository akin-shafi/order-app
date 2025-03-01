import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#ffecd8] py-4 px-4 sm:px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Palapolo Logo"
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          {["Know Us", "Become a rider", "Contact Us"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-[#461914] hover:text-[#6b2d23] text-sm lg:text-base"
            >
              {item}
            </Link>
          ))}
        </nav>

        <Link
          href="#"
          className="bg-[#210603] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm"
        >
          Visit Store
        </Link>
      </header>

      {/* Hero Section */}
      <section className="bg-[#ffecd8] pt-6 pb-20 px-4 sm:px-6 md:px-12 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="text-[#210603] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug">
              Are you starving?
              <br />
              Palapolo is here
            </h1>

            <p className="text-[#461914] mt-3 md:mt-4 text-sm md:text-base max-w-md mx-auto md:mx-0">
              The food at your doorstep. Why starve when you have us. Name for
              you on time. Straight out of the oven to your doorstep.
            </p>

            <div className="mt-6 flex flex-col gap-2 bg-white p-1 rounded-full max-w-md mx-auto md:mx-0">
              <div className="flex-1 flex items-center bg-white rounded-full pl-2">
                <MapPin className="text-[#f15736] h-4 w-4 md:h-5 md:w-5 mr-2" />
                <input
                  type="text"
                  placeholder="What is your address?"
                  className="bg-transparent border-none outline-none w-full py-2 text-xs md:text-sm"
                />
              </div>
              <button className="bg-[#f15736] text-white rounded-full px-4 py-2 flex items-center justify-center text-xs md:text-sm">
                <Navigation className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                Use current location
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 relative h-48 sm:h-64 md:h-auto">
            <Image
              src="/images/beatsnoop.png"
              alt="Food Delivery"
              layout="responsive"
              width={400}
              height={300}
              className="object-contain"
            />
          </div>
        </div>

        {/* Wave shape */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-white curved-divider"></div>
      </section>

      {/* Deals Section */}
      <section className="py-12 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center">
          <div className="w-full md:w-1/2">
            <Image
              src="/images/package.png"
              alt="Food Bag"
              layout="responsive"
              width={300}
              height={250}
              className="object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#292d32]">
              Find <span className="text-[#f15736]">deals</span>,{" "}
              <span className="text-green-600">get delivery</span>, and more
              <br />
              from our restaurant partners.
            </h2>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#292d32]">
              Explore Categories
            </h2>
            <Link
              href="#"
              className="bg-[#210603] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm"
            >
              Visit Store
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white p-2 md:p-4 rounded-lg flex flex-col items-center"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mb-1 md:mb-2">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <span className="text-[#292d32] font-medium text-xs md:text-sm text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-[#292d32] mb-2">
            Delicacy with good treat
          </h2>
          <p className="text-center text-[#676767] text-sm md:text-base mb-8 md:mb-12">
            Welcome to The Biggest Network of Food Ordering & Delivery
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-4 md:p-6 rounded-lg ${
                  index === 0
                    ? "bg-[#fff2f1]"
                    : "bg-white border border-[#d9d9d9]"
                }`}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3 md:mb-4">
                  <Image
                    src={`/icons/${feature.image}`}
                    alt={feature.title}
                    width={40}
                    height={40}
                  />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#292d32] mb-1 md:mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#676767] text-xs md:text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-12 px-6 md:px-12 bg-white border border-[#d9d9d9] mx-6 md:mx-12 rounded-lg relative -mb-16 z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className="bg-[#eff3fd] w-24 h-24 rounded-lg mb-4"></div>
              <div className="h-2 bg-[#d9d9d9] w-24 rounded-full mb-2"></div>
              <div className="h-2 bg-[#d9d9d9] w-16 rounded-full"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#210603] py-24 px-6 md:px-12 pt-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Make we help you deliver your food.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-[#d9d9d9] h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="bg-[#f15736] py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array(3)
            .fill("THE MORE IT TELLS YOU, THE LESS YOU KNOW")
            .map((text, i) => (
              <span
                key={i}
                className="text-white mx-4 uppercase text-sm font-medium"
              >
                {text}
              </span>
            ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#210603] py-8 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-white text-sm mb-4">
              One cannot <strong>think well, love well, sleep well,</strong> if
              one has not dined well.
            </p>

            <div className="flex justify-center mb-6">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Palapolo Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-white font-bold text-xl">palapolo</span>
            </div>

            <div className="flex justify-center space-x-4">
              <Link href="#" className="text-white text-sm">
                WhatsApp
              </Link>
              <Link href="#" className="text-white text-sm">
                Instagram
              </Link>
            </div>
          </div>

          <div className="border-t border-[#461914] pt-4">
            <p className="text-white text-xs text-center">
              ©2024 Palapolo. All rights reserved
            </p>
          </div>
        </div>
      </footer>
      {/* Remaining sections follow similar mobile-first patterns... */}
    </div>
  );
}

const categories = [
  { name: "Beans Combo", image: "/images/beans.png" },
  { name: "Rice Dishes", image: "/images/rice.png" },
  { name: "Swallows", image: "/images/swallow.png" },
  { name: "Small Chops", image: "/images/small_chops.png" },
  { name: "Fast Meals", image: "/images/fast_meal.png" },
];

const features = [
  {
    image: "location-1.png",
    title: "Wide selection of restaurants",
    description:
      "Lorem ipsum dolor sit amet consectetur. Ornare massa nunc nibh tristique.",
  },
  {
    image: "cup-1.png",
    title: "Easy ordering process",
    description:
      "Lorem ipsum dolor sit amet consectetur. Ornare massa nunc nibh tristique.",
  },
  {
    image: "fast-delivery.png",
    title: "Fast delivery within 20 min",
    description:
      "Lorem ipsum dolor sit amet consectetur. Ornare massa nunc nibh tristique.",
  },
];
