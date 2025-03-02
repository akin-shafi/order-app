// components/CategoriesSection.tsx
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/content";

export default function CategoriesSection() {
  return (
    <section className="py-12 px-4 sm:px-6 md:px-12 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#292d32]">
            Explore Categories
          </h2>
          <Link
            href="#"
            className="bg-[#210603] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm hover:bg-[#F15736] transition-colors duration-300"
          >
            Store front..
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-2 md:p-4 rounded-lg flex flex-col items-center hover:bg-[#f5f5dc] hover:cursor-pointer transition-colors duration-300"
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
  );
}
