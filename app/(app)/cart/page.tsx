"use client";

import { useNotification } from "@/app/_contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { truncateText } from "@/lib/text-reduce";
import Image from "next/image";

type CartItem = {
  id: number;
  food_item_id: number;
  cart_qty: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    foodImages: string[];
  };
};

const CartPage = () => {
  const { user } = useAuth({ middleware: "guest" });
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [disableCheckoutBtn, setDisableCheckoutBtn] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const { showNotification } = useNotification();
  const router = useRouter();

  const fetchCarts = async () => {
    try {
      const payload = { user_id: user.id };
      const response = await axios.post("/api/client/get/cart/all", payload);
      setItems(response.data.data);

      // Initialize quantities state
      const initialQuantities: { [key: number]: number } = {};
      response.data.data.forEach((item: CartItem) => {
        initialQuantities[item.food_item_id] = item.cart_qty;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error("Error fetching products:", error);
      showNotification("Error", "Failed to fetch cart items");
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  useEffect(() => {
    setDisableCheckoutBtn(
      Object.keys(checkedItems).length === 0 ||
        !Object.values(checkedItems).some((isChecked) => isChecked)
    );
  }, [checkedItems]);

  const handleCheckboxChange = (productId: number) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [productId]: !prevCheckedItems[productId],
    }));
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: Math.max(1, (prevQuantities[productId] || 1) + delta),
    }));
  };

  const handleCheckout = async () => {
    const selectedItems = Object.keys(checkedItems)
      .filter((key) => checkedItems[parseInt(key)])
      .map((key) => parseInt(key));
    if (selectedItems.length > 0) {
      const quantitiesArray = selectedItems.map((id) => quantities[id] || 1);
      try {
        router.push(
          `/checkout?product_ids=${selectedItems.join(
            ","
          )}&quantity=${quantitiesArray.join(",")}`
        );
      } catch (error) {
        console.error("Error during checkout:", error);
        showNotification("Error", "Failed to proceed to checkout");
      }
    } else {
      showNotification("Warning", "No items selected");
    }
  };

  const calculateTotalAmount = () => {
    return items.reduce((total, item) => {
      if (checkedItems[item.food_item_id]) {
        const quantity = quantities[item.food_item_id] || item.cart_qty;
        return total + item.product.price * quantity;
      }
      return total;
    }, 0);
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Cart</h1>
            <div className="flex justify-between gap-x-4 ">
              <div>
                {Array.isArray(items) && items.length > 0 ? (
                  items.map((item) => (
                    <Card key={item.id} className="flex justify-between w-full">
                      <div className="flex items-center mx-3 ">
                        <Checkbox
                          checked={!!checkedItems[item.food_item_id]}
                          onChange={() =>
                            handleCheckboxChange(item.food_item_id)
                          }
                          onClick={() =>
                            handleCheckboxChange(item.food_item_id)
                          }
                        />
                      </div>
                      <CardHeader className="p-2 flex justify-center items-center">
                        <Image
                          width={200}
                          height={200}
                          className="w-48 h-48 object-cover" // Fixed size and object-fit property
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.product.foodImages[0]}`}
                          alt={item.product.name}
                        />
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col p-4 gap-y-5">
                        <CardTitle className="text-lg font-semibold">
                          {item.product.name}
                        </CardTitle>
                        <p className="text-sm text-gray-700 mb-2">
                          {truncateText(item.product.description, 140)}
                        </p>
                        <div className="text-lg font-semibold">
                          Rs. {item.product.price.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.food_item_id, -1)
                            }
                            className="px-3 py-2 bg-gray-300 rounded-l-lg text-lg hover:bg-gray-400 transition duration-200"
                          >
                            -
                          </button>
                          <span className=" px-4 py-2 bg-gray-200 text-lg font-semibold">
                            {quantities[item.food_item_id]}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.food_item_id, 1)
                            }
                            className="px-3 py-2 bg-gray-300 rounded-r-lg text-lg hover:bg-gray-400 transition duration-200"
                          >
                            +
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No Item in Cart</p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <p className="mr-4">
                Total Amount - Rs. {calculateTotalAmount().toFixed(2)}
              </p>
              <Button onClick={handleCheckout} disabled={disableCheckoutBtn}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
