"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { cartSchema } from "@/schemas";
import { AddorUpdateCart } from "@/app/api/addorUpdateCart";
import { z } from "zod";
import Image from "next/image";
import { useAuth } from "@/hooks/auth";
import { Button } from "@/components/ui/button";

const SingleProductPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const { showNotification } = useNotification();
  const router = useRouter();
  const { user } = useAuth({ middleware: "guest" });

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await axios.get(
            `/api/get/products?product_id=${productId}`
          );
          if (response.data.success) {
            setProduct(response.data.data);
            setTotalPrice(response.data.data.price); // Set initial total price here
          } else {
            console.error("Product not found:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      router.back();
    }
    // Check if product is not null before accessing its price
    if (product) {
      setTotalPrice(product.price * quantity); // Update total price whenever quantity or product changes
      //alert(totalPrice);
    }
  }, [product, quantity]); // Add product as a dependency here

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    router.push(`/checkout?product_ids=${productId}&quantity=${quantity}`);
  };

  if (!product) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  const addToCart = async (productId: string, quantity: number) => {
    const data = {
      product_id: productId.toString(),
      cart_qty: quantity,
      user_id: user?.id.toString(),
    };

    try {
      await cartSchema.parseAsync(data);
      const result = await AddorUpdateCart(data);

      if (result?.success) {
        showNotification(
          "success",
          result.message || "Cart updated successfully"
        );
      } else {
        showNotification("error", result?.message || "An error occurred");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation Error:", error.errors);
        showNotification(
          "error",
          "Invalid data provided. Please check your input."
        );
      } else {
        console.error("Error adding to cart:", error.message);
        showNotification(
          "error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 p-4">
          <Image
            src={`http://localhost:8000/storage/${product.foodImages[0]}`}
            alt={product.name}
            quality="100"
            width={1000}
            height={1000}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/2">
          <div className="flex flex-col gap-y-10">
            <div>
              <h1 className="text-5xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-700 mb-4">{product.description}</p>
            </div>
            <div>
              <div className="flex flex-col gap-y-10">
                <p className="text-6xl">Rs. {totalPrice}</p>
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className=" px-10 py-6 bg-gray-300 rounded-l-lg text-3xl hover:bg-gray-400 transition duration-200"
                  >
                    -
                  </button>
                  <span className=" px-14 py-6 bg-gray-200 text-3xl font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-10 py-6 bg-gray-300 rounded-r-lg text-3xl hover:bg-gray-400 transition duration-200"
                  >
                    +
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    disabled={product.stock < 1}
                    onClick={handleAddToCart}
                    className="px-4 py-10 bg-blue-500 text-white rounded-lg"
                  >
                    Add to Cart
                  </Button>

                  <Button
                    onClick={handleBuyNow}
                    className="px-4 py-10 bg-green-500 text-white rounded-lg"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
