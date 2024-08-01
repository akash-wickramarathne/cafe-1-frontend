"use client";

import { useNotification } from "@/app/_contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCarousel } from "@/components/common/ProductCarousel";
import { Checkbox } from "@/components/ui/checkbox";

type CartItem = {
  id: number;
  food_item_id: number;
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

  const { showNotification } = useNotification();
  const router = useRouter();

  const fetchCarts = async () => {
    try {
      const payload = { user_id: user.id };
      const response = await axios.post("/api/client/get/cart/all", payload);
      setItems(response.data.data);
      console.log(items);
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

  const handleCheckout = async () => {
    const selectedItems = Object.keys(checkedItems)
      .filter((key) => checkedItems[parseInt(key)])
      .map((key) => parseInt(key));
    if (selectedItems.length > 0) {
      try {
        router.push(`/checkout?product_ids=${selectedItems.join(",")}`);
      } catch (error) {
        console.error("Error during checkout:", error);
        showNotification("Error", "Failed to proceed to checkout");
      }
    } else {
      showNotification("Warning", "No items selected");
    }
  };

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            You are logged in!
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="p-2 flex justify-center items-center">
                    <ProductCarousel productImages={item.product.foodImages} />
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-4">
                    <div className="flex justify-between items-center mb-2">
                      <CardTitle className="text-lg font-semibold">
                        {item.product.name}
                      </CardTitle>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[item.food_item_id]}
                        onChange={() => handleCheckboxChange(item.food_item_id)}
                      />
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {item.product.description}
                    </p>
                    <div className="text-lg font-semibold">
                      ${item.product.price.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-4">
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
