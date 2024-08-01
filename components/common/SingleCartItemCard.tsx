"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCarousel } from "./ProductCarousel";
import { Checkbox } from "../ui/checkbox";

type CartItem = {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    foodImages: string[];
  };
};

export const SingleProductCartItemCard = ({
  cartItem,
  checked,
  onCheckboxChange,
}: {
  cartItem: CartItem;
  checked: boolean;
  onCheckboxChange: (itemId: number, isChecked: boolean) => void;
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(cartItem.product.id, event.target.checked);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-2 flex justify-center items-center">
        <ProductCarousel productImages={cartItem.product.foodImages} />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg font-semibold">
            {cartItem.product.name}
          </CardTitle>
          {/* <input
            type="checkbox"
            className="checkbox checkbox-primary"
            id={`select-product-${cartItem.product.id}`}
            checked={checked}
            onChange={handleCheckboxChange}
          /> */}
          <Checkbox
            id={`select-product-${cartItem.product.id}`}
            checked={checked}
            onChange={handleCheckboxChange}
          />
        </div>
        <p className="text-sm text-gray-700 mb-2">
          {cartItem.product.description}
        </p>
        <div className="text-lg font-semibold">
          ${cartItem.product.price.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
};
