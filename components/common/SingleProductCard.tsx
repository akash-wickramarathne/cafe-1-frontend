"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductCarousel } from "./ProductCarousel";
import { useRouter } from "next/navigation";

export const SingleProductCard = ({
  product,
  handleCartClick,
  handleWishslitClick,
}: {
  product: Product;
  handleCartClick: (quantity: number) => void;
  handleWishslitClick: () => void;
  // Updated to accept quantity
}) => {
  const navigate = useRouter();
  const handleAddToCart = () => {
    // Assuming a fixed quantity for demonstration. Adjust as needed.
    const quantity = 1;
    handleCartClick(quantity);
  };

  const handleGoToSingleProduct = () => {
    navigate.push(`/product?product_id=${product.id}`);
  };

  const handleWishlist = () => {
    handleWishslitClick();
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="flex flex-col">
      {/* Carousel at the top */}
      <CardHeader
        className="p-2 flex justify-center items-center"
        onClick={handleGoToSingleProduct}
      >
        <ProductCarousel productImages={product.foodImages} />
      </CardHeader>

      {/* Product details */}
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Product Name */}
        <CardTitle
          className="text-lg font-semibold mb-2"
          onClick={handleGoToSingleProduct}
        >
          {product.name}
        </CardTitle>

        {/* Product Description */}
        <div
          className="flex-1 mb-2 overflow-hidden"
          onClick={handleGoToSingleProduct}
        >
          <p className="text-sm text-gray-700">
            {truncateText(product.description, 150)}
          </p>
        </div>

        {/* Product Price */}
        <div
          className="text-lg font-semibold mb-4"
          onClick={handleGoToSingleProduct}
        >
          ${product.price.toFixed(2)}
        </div>

        <Button
          className="w-full bg-blue-500 "
          onClick={handleAddToCart}
          disabled={product.stock < 1}
        >
          Add to Cart
        </Button>
        <Button
          className="w-full mt-2 bg-green-600 hover:bg-green-800 "
          onClick={handleWishslitClick}
          //   disabled={product.stock == 0}
        >
          Add to Wishlist
        </Button>
      </CardContent>
    </Card>
  );
};
