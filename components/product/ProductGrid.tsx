// components/ProductGrid.tsx
import React from "react";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: string;
    description: string;
    image: string | null;
    business: {
      name: string;
    };
  }>;
  onAddToCart: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          businessName={product.business.name}
          name={product.name}
          price={product.price}
          description={product.description}
          image={product.image}
          onAddToCart={() => onAddToCart(product.id)}
        />
      ))}
    </div>
  );
};
