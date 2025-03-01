// components/FeaturesSection.tsx
import Image from "next/image";
import { features } from "@/data/content";

export default function FeaturesSection() {
  return (
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
  );
}
