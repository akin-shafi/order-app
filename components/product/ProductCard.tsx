// components/ProductCard.tsx
import React, { useState } from "react";
import Image from "next/image";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { RateProductModal } from "./RateProductModal";
import { Rate } from "antd";

interface ProductCardProps {
  businessName: string;
  name: string;
  description: string;
  price: string;
  image: string | null;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  businessName,
  name,
  description,
  price,
  image,
  onAddToCart,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(3); // Default rating for display

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add logic to save the like status to your backend if needed
  };

  const handleRateSubmit = (newRating: number) => {
    setRating(newRating);
    // Add logic to save the rating to your backend
    console.log(`Rated ${name} with ${newRating} stars`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-40">
        {image ? (
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-xl">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center justify-center rounded-full cursor-pointer absolute right-[21px] top-[12px] bg-brand-white w-[40px] h-[40px] active:opacity-70"
        >
          {isLiked ? (
            <HeartFilled style={{ color: "#FF6600" }} />
          ) : (
            <HeartOutlined style={{ color: "#FF6600" }} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Business Name */}
        <p className="text-sm text-gray-500">{businessName}</p>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-[#000000] truncate-text">{name}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 truncate">{description}</p>

        {/* Price and Add to Cart */}
        <div className="mt-2 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <span className="text-[#FF6600] font-bold">₦{price}</span>
          <button
            onClick={onAddToCart}
            className="bg-[#FF6600] text-white text-sm px-3 py-1 rounded-full hover:bg-[#e65c00] self-end md:self-auto w-full md:w-auto"
          >
            Add to Cart
          </button>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center">
          <span
            className="text-[#FF6600] cursor-pointer"
            onClick={() => setIsModalVisible(true)}
          >
            <Rate disabled value={rating} style={{ fontSize: 16 }} />
          </span>
          <span className="ml-2 text-sm text-gray-500">({rating})</span>
        </div>
      </div>

      {/* Rating Modal */}
      <RateProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleRateSubmit}
        productName={name}
      />
    </div>
  );
};
