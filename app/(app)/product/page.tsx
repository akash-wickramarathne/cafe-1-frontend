"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Use only useSearchParams
import axios from "@/lib/axios";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { cartSchema } from "@/schemas";
import { AddorUpdateCart } from "@/app/api/addorUpdateCart";
import { z } from "zod";

const SingleProductPage = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id"); // Get the product_id from the search params
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await axios.get(
            `/api/get/products?product_id=${productId}`
          );
          if (response.data.success) {
            setProduct(response.data.data); // Assuming your API response structure contains 'data'
          } else {
            console.error("Product not found:", response.data.message);
            // Optionally, redirect to a 404 page or show a message
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          // Optionally, redirect to a 404 page or show a message
        }
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  const handleBuyNow = () => {
    // Navigate to the checkout page with the product ID
    router.push(`/checkout?product_ids=${productId}`); // Change the URL as needed
  };

  if (!product) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 p-4">
          <img
            src={`http://localhost:8000/storage/${product.foodImages[0]}`} // Adjust based on your image URL structure
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <h3 className="">Rs. {product.price}</h3>
          <div className="flex items-center mb-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-2 bg-gray-200 rounded-l-lg"
            >
              -
            </button>
            <span className="px-4 py-2 bg-gray-100">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-2 bg-gray-200 rounded-r-lg"
            >
              +
            </button>
          </div>
          <div className="flex space-x-4">
            {/* <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Add to Cart
            </button> */}

            <button
              onClick={handleBuyNow}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "@/lib/axios";

// const SingleProductPage = () => {
//   const searchParams = useSearchParams();
//   const productId = searchParams.get("product_id");
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     if (productId) {
//       const fetchProduct = async () => {
//         try {
//           const response = await axios.get(
//             `/api/get/products?product_id=${productId}`
//           );
//           setProduct(response.data);
//         } catch (error) {
//           console.error("Product not found:", error);
//           //  router.push("/404"); // Navigate to 404 page if product not found
//         }
//       };

//       fetchProduct();
//     }
//   }, [productId, productId]);

//   const handleQuantityChange = (amount) => {
//     setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
//   };

//   const handleAddToCart = () => {
//     console.log(`Added ${quantity} of ${product.name} to cart.`);
//   };

//   const handleBuyNow = () => {
//     console.log(`Bought ${quantity} of ${product.name}.`);
//   };

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex flex-col md:flex-row items-center">
//         <div className="w-full md:w-1/2 p-4">
//           <img
//             src={`http://localhost:8000/store/product/${product.image}`} // Adjust this based on your image URL structure
//             alt={product.name}
//             className="w-full h-auto rounded-lg shadow-lg"
//           />
//         </div>
//         <div className="w-full md:w-1/2 p-4">
//           <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
//           <p className="text-gray-700 mb-4">{product.description}</p>
//           <div className="flex items-center mb-4">
//             <button
//               onClick={() => handleQuantityChange(-1)}
//               className="px-3 py-2 bg-gray-200 rounded-l-lg"
//             >
//               -
//             </button>
//             <span className="px-4 py-2 bg-gray-100">{quantity}</span>
//             <button
//               onClick={() => handleQuantityChange(1)}
//               className="px-3 py-2 bg-gray-200 rounded-r-lg"
//             >
//               +
//             </button>
//           </div>
//           <div className="flex space-x-4">
//             <button
//               onClick={handleAddToCart}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={handleBuyNow}
//               className="px-4 py-2 bg-green-500 text-white rounded-lg"
//             >
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SingleProductPage;
