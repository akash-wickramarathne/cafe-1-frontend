"use client";

import { useNotification } from "@/app/_contexts/NotificationContext";
import { AddorUpdateCart } from "@/app/api/addorUpdateCart";
import { addWishlist } from "@/app/api/addWishlist";
import { getFoods } from "@/app/api/getFoods";
import Header from "@/components/clients/Header";
import Header2 from "@/components/clients/Header2";
import { Navbar } from "@/components/clients/Navbar";
import { ProductCarousel } from "@/components/common/ProductCarousel";
import { SingleProductCard } from "@/components/common/SingleProductCard";
import { useAuth } from "@/hooks/auth";
import { useFetchUserRole } from "@/hooks/user-current-role";
import axios from "@/lib/axios";
import { cartSchema, wishlistSchema } from "@/schemas";
import { useEffect, useState } from "react";
import { z } from "zod";

const Dashboard = () => {
  const { user } = useAuth({ middleware: "guest" });
  const userRole = useFetchUserRole();
  const [products, setProducts] = useState<Product[]>([]);
  const { showNotification } = useNotification();

  const fetchProducts = async () => {
    try {
      //const response = await getFoods();
      const response = await axios.get("/api/get/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    const data = {
      product_id: productId.toString(), // Ensure the type matches schema expectations
      cart_qty: quantity,
      user_id: user?.id.toString(), // Ensure the type matches schema expectations
    };

    console.log("Data to be validated:", data);

    try {
      // Validate data
      await cartSchema.parseAsync(data);

      // Proceed with API call
      const result = await AddorUpdateCart(data);

      if (result?.success) {
        showNotification(
          "success",
          result.message || "Cart updated successfully"
        );
      } else {
        // Handle API response indicating failure
        showNotification("error", result?.message || "An error occurred");
      }

      console.log("Cart update result:", result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error("Validation Error:", error.errors);
        showNotification(
          "error",
          "Invalid data provided. Please check your input."
        );
      } else if (error instanceof Error) {
        // Handle generic errors
        console.error("Error adding to cart:", error.message);
        showNotification(
          "error",
          "An unexpected error occurred. Please try again."
        );
      } else {
        // Handle unexpected error types
        console.error("Unknown error:", error);
        showNotification("error", "An unknown error occurred.");
      }
    }
  };
  const addToWishlist = async (productId: string) => {
    const data = {
      product_id: productId.toString(), // Ensure the type matches schema expectations
      user_id: user?.id.toString(), // Ensure the type matches schema expectations
    };

    console.log("Data to be validated:", data);

    try {
      // Validate data
      await wishlistSchema.parseAsync(data);

      // Proceed with API call
      const result = await addWishlist(data);

      if (result?.success) {
        showNotification(
          "success",
          result.message || "Wishlist updated successfully"
        );
      } else {
        // Handle API response indicating failure
        showNotification("error", result?.message || "An error occurred");
      }

      console.log("Cart update result:", result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error("Validation Error:", error.errors);
        showNotification(
          "error",
          "Invalid data provided. Please check your input."
        );
      } else if (error instanceof Error) {
        // Handle generic errors
        console.error("Error adding to wishslist:", error.message);
        showNotification(
          "error",
          "An unexpected error occurred. Please try again."
        );
      } else {
        // Handle unexpected error types
        console.error("Unknown error:", error);
        showNotification("error", "An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Header2 />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <SingleProductCard
                    key={product.id}
                    product={product}
                    handleCartClick={(quantity) =>
                      addToCart(product.id.toString(), quantity)
                    }
                    handleWishslitClick={() =>
                      addToWishlist(product.id.toString())
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
