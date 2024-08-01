"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { truncateText } from "@/lib/text-reduce";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
  const quantities = searchParams.get("quantity");
  const [products, setProducts] = useState<Product[]>([]);
  const [quantitiesArray, setQuantitiesArray] = useState<number[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    if (product_ids && quantities) {
      const fetchProducts = async () => {
        try {
          const ids = product_ids.split(",").map(Number);
          const qtys = quantities.split(",").map(Number);
          setQuantitiesArray(qtys); // Set quantities array
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
  }, [product_ids, quantities]);

  const handleCheckboxChange = (id: number) => {
    setSelectedProductIds(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((productId) => productId !== id) // Unselect if already selected
          : [...prevSelected, id] // Select the product
    );
  };

  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = selectedProductIds.reduce((sum, productId) => {
        const productIndex = products.findIndex((p) => p.id === productId);
        const quantity = quantitiesArray[productIndex];
        const product = products[productIndex];
        return sum + product.price * quantity;
      }, 0);
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [selectedProductIds, products, quantitiesArray]);

  const handlePlaceOrder = async () => {
    if (selectedProductIds.length > 0) {
      try {
        const orderItems = selectedProductIds.map((productId) => {
          const productIndex = products.findIndex((p) => p.id === productId);
          const quantity = quantitiesArray[productIndex];
          return {
            product_id: productId,
            quantity: quantity || 1, // Use the corresponding quantity or default to 1
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
            <div className="flex justify-between gap-x-4 ">
              <div className="w-9/12  ">
                {products.map((product, index) => (
                  <Card
                    key={product.id}
                    className="flex justify-between w-full"
                  >
                    <div className="flex items-center mx-3 ">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => handleCheckboxChange(product.id)}
                        onClick={() => handleCheckboxChange(product.id)}
                      />
                    </div>
                    <CardHeader className="p-2 flex justify-center items-center">
                      <Image
                        width={200}
                        height={200}
                        className="w-48 h-48 object-cover"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${product.foodImages[0]}`}
                        alt={product.name}
                      />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-4 gap-y-5">
                      <CardTitle className="text-lg font-semibold">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-700 mb-2">
                        {truncateText(product.description, 140)}
                      </p>
                      <div className="text-lg font-semibold">
                        Rs. {product.price.toFixed(2)}
                      </div>
                      <div className="text-lg font-semibold">
                        Quantity: {quantitiesArray[index]}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-white rounded-lg shadow-md w-3/12 p-5 flex flex-col justify-between gap-y-3 ">
                <div>
                  <h1 className="text-2xl font-bold mb-4">Payment</h1>
                  <p>
                    Total Amount - <span>Rs.{totalAmount.toFixed(2)}</span>
                  </p>
                  <p>
                    Sevice Charges - <span>Rs.0.00</span>
                  </p>
                </div>

                <Button
                  disabled={totalAmount < 1}
                  onClick={handlePlaceOrder}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
