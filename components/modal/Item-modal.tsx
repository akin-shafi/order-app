/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDown, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ItemModalProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string | null;
  };
  onClose: () => void;
  onAddToCart?: (item: any, quantity: number, selectedOptions: any) => void;
}

export default function ItemModal({
  item,
  onClose,
  onAddToCart,
}: ItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBread, setSelectedBread] = useState("Regular Bread");

  const breadOptions = [
    { name: "Regular Bread", price: 200 },
    { name: "Whole Wheat", price: 250 },
    { name: "Gluten-Free", price: 300 },
  ];

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectBread = (bread: string) => {
    setSelectedBread(bread);
    setIsDropdownOpen(false);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item, quantity, { bread: selectedBread });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto relative p-4 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full shadow-sm z-10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col">
          {/* Image */}
          <div className="w-full h-[200px] md:h-[250px] lg:h-[300px] relative rounded-t-xl overflow-hidden mb-4">
            <Image
              src={item.image || "/images/food.png"}
              alt={item.name}
              fill
              style={{ objectFit: "cover" }}
              className="transition-all duration-300"
            />
          </div>

          {/* Content */}
          <div className="px-2 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#292d32]">
                {item.name}
              </h3>
              <p className="text-lg md:text-xl lg:text-2xl font-semibold text-[#292d32]">
                {item.price}
              </p>
            </div>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              {item.description}
            </p>

            {/* Bread Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm md:text-base font-medium text-[#292d32]">
                  Bread{" "}
                  <span className="text-[#ff6600] text-xs font-semibold">
                    Required
                  </span>
                </label>
                <button onClick={toggleDropdown} className="focus:outline-none">
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <div className="relative">
                <div className="border border-gray-300 rounded py-2 px-3 text-sm md:text-base text-gray-700 flex justify-between items-center">
                  <span>
                    {selectedBread} ₦
                    {
                      breadOptions.find((opt) => opt.name === selectedBread)
                        ?.price
                    }
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-20 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg">
                    {breadOptions.map((option) => (
                      <div
                        key={option.name}
                        onClick={() => selectBread(option.name)}
                        className="py-2 px-3 text-sm md:text-base text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      >
                        <span>{option.name}</span>
                        <span>₦{option.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  <Minus className="h-4 w-4 text-gray-700" />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-700" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base font-medium"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
