"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  foodImages: string[];
};

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const product_ids = searchParams.get("product_ids");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  useEffect(() => {
    if (product_ids) {
      const fetchProducts = async () => {
        try {
          const ids = product_ids.split(",").map(Number);
          const response = await axios.get("/api/get/products", {
            params: {
              food_item_ids: ids.join(","),
            },
          });
          setProducts(response.data.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      fetchProducts();
    } else {
      redirect("/cart");
    }
  }, [product_ids]);

  const handleCheckboxChange = (id: number) => {
    setSelectedProductIds(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((productId) => productId !== id) // Unselect if already selected
          : [...prevSelected, id] // Select the product
    );
  };

  const handlePlaceOrder = async () => {
    if (selectedProductIds.length > 0) {
      try {
        const orderItems = selectedProductIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          return {
            product_id: product?.id,
            quantity: 1, // Assuming 1 for simplicity. Adjust as needed.
          };
        });

        const response = await axios.post("/api/client/make-payment", {
          order_items: orderItems,
        });

        const { url } = response.data;
        window.location.href = url;
      } catch (error) {
        console.error("Error placing order:", error);
      }
    } else {
      alert("Please select at least one product to place an order.");
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <CardHeader className="p-2 flex justify-center items-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}\\storage\\${product.foodImages[0]}`}
                      alt={product.name}
                    />
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-4">
                    <CardTitle className="text-lg font-semibold">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-gray-700 mb-2">
                      {product.description}
                    </p>
                    <div className="text-lg font-semibold">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => handleCheckboxChange(product.id)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm"
                      >
                        Select
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <button
              onClick={handlePlaceOrder}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
