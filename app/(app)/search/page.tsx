"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { SingleProductCard } from "@/components/common/SingleProductCard";
import { cartSchema, wishlistSchema } from "@/schemas";
import { addWishlist } from "@/app/api/addWishlist";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { AddorUpdateCart } from "@/app/api/addorUpdateCart";
import { z } from "zod";
import { useAuth } from "@/hooks/auth";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth({ middleware: "guest" });

  const [searchProductsList, setSearchProductsList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { showNotification } = useNotification();

  const searchProduct = async (page = 1) => {
    try {
      const params = new URLSearchParams();
      if (searchParams.get("minPrice")) {
        params.append("minPrice", searchParams.get("minPrice"));
      }
      if (searchParams.get("maxPrice")) {
        params.append("maxPrice", searchParams.get("maxPrice"));
      }
      if (searchParams.get("query")) {
        params.append("query", searchParams.get("query"));
      }
      if (searchParams.get("sort")) {
        params.append("sort", searchParams.get("sort"));
      }
      if (searchParams.get("category_id")) {
        params.append("category_id", searchParams.get("category_id"));
      }
      if (searchParams.get("brand_id")) {
        params.append("brand_id", searchParams.get("brand_id"));
      }
      params.append("page", page);

      const response = await axios.get("/api/search?" + params.toString());
      let productsData = response.data.products;

      setSearchProductsList(productsData);
      setCurrentPage(response.data.pagination.current_page);
      setTotalPages(response.data.pagination.total_pages);
      setTotalProducts(response.data.pagination.total);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  useEffect(() => {
    searchProduct();
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    searchProduct(newPage);
    setCurrentPage(newPage);
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

      console.log("Wishlist update result:", result);
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
        console.error("Error adding to wishlist:", error.message);
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

  return (
    <div className="flex flex-col max-h-screen">
      <div className="flex-grow">
        {Array.isArray(searchProductsList) && searchProductsList.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
              {searchProductsList.map((product) => (
                <div key={product.id}>
                  <SingleProductCard
                    handleCartClick={(quantity) =>
                      addToCart(product.id.toString(), quantity)
                    }
                    handleWishslitClick={() =>
                      addToWishlist(product.id.toString())
                    }
                    product={product} // Pass the product data to SingleProductCard
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-white text-center p-6">No Products Found</p>
        )}
        <div className="pagination-controls flex justify-center p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 bg-gray-300 rounded-l hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-200">
            {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 bg-gray-300 rounded-r hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
