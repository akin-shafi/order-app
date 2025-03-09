// components/modal/ItemModal.tsx
import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface ItemModalProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    image: string;
    popular?: boolean;
  };
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose }) => {
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedBread, setSelectedBread] = useState<string>("Agege Bread"); // Default bread option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const breadOptions = [
    { name: "Agege Bread", price: 200 },
    { name: "Agege Bread", price: 200 }, // Repeated as per the image
  ];

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image || "/images/food.png",
        quantity,
        selectedBread, // Include selected bread in the payload
      },
    });
    onClose();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const selectBread = (bread: string) => {
    setSelectedBread(bread);
    setIsDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-opacity  flex items-center justify-center p-4">
      {/* <div className="bg-white rounded-lg w-full max-w-md relative"> */}
      <div className="bg-white rounded-lg w-full max-w-md relative md:max-w-md mobile-modal">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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

        {/* Modal Content */}
        <div className="flex flex-col">
          {/* Image */}
          <div className="relative w-full h-48">
            <Image
              src={item.image || "/images/food.png"}
              alt={item.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>

          {/* Item Details */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-[#292d32]">
                {item.name}
              </h3>
              <p className="text-lg font-semibold text-[#292d32]">
                {item.price}
              </p>
            </div>
            <p className="text-gray-500 text-sm mb-4">{item.description}</p>

            {/* Bread Selection */}
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#292d32]">
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
                <div className="border border-gray-300 rounded py-2 px-3 mt-1 text-sm text-gray-700 flex justify-between items-center">
                  <span>
                    {selectedBread} ₦{breadOptions[0].price}
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 shadow-md">
                    {breadOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => selectBread(option.name)}
                        className="py-2 px-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      >
                        <span>{option.name}</span>
                        <span>₦{option.price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg gap-4">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-200"
                >
                  <Minus className="h-4 w-4 text-gray-700" />
                </button>
                <span className="text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 text-gray-700" />
                </button>
              </div>
              {/* Add to Order Button */}
              <div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1  bg-[#1A2E20] text-white py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                >
                  Add this item to my order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
