// components/HeroSection.tsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
// import Link from "next/link";

import { textGroups } from "@/data/content";
// import OrderDirectly from "./OrderDirectly";
import AddressField from "./AddressField";

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % textGroups.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#ffecd8] pb-20 px-4 sm:px-6 md:px-12 relative pt-32 md:pt-0">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8 items-center md:h-auto mt-0 md:mt-20 lg:mt-0">
        <div className="order-2 md:order-1 text-center md:text-left">
          {/* Animated Text Container */}
          <div className="relative h-[160px] md:h-[200px] overflow-hidden">
            {textGroups.map((group, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-500 ${
                  index === activeIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <h1 className="text-[#210603] text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-snug">
                  <span className="animate-fadeIn">{group.headline}</span>
                  <br />
                  <span className="text-[#f15736] animate-fadeInDelay">
                    {group.subline}
                  </span>
                </h1>

                <p className="text-[#461914] mt-3 md:mt-4 text-sm md:text-base max-w-md mx-auto md:mx-0 animate-slideIn">
                  {group.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {/* <OrderDirectly /> */}
          <AddressField />
        </div>

        {/* Image Section */}
        <div className="hidden md:block order-1 md:order-2 relative h-48 sm:h-64 ">
          <Image
            src="/images/beatsnoop.png"
            alt="Food Delivery"
            layout="responsive"
            width={400}
            height={300}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Wave shape */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white curved-divider"></div>
    </section>
  );
}
