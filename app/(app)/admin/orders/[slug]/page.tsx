"use client";

import { CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { SkeletonSm } from "@/components/common/SkeletonSm";
import NotFound from "@/app/(app)/notfound";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { truncateText } from "@/lib/text-reduce";
import { Button } from "@/components/ui/button";
import DotLoader from "react-spinners/DotLoader";
import HashLoader from "react-spinners/HashLoader";

interface FoodItem {
  food_item_id: number;
  food_name: string;
  description: string;
  price: number;
  food_images: string[]; // Assuming food_images is a JSON string
  food_category_id: number;
  created_at: string;
  updated_at: string;
  stock: number;
}

interface OrderItem {
  id: number;
  food_item_id: number;
  order_id: number;
  quantity: number;
  price: string;
  food_item: FoodItem; // Include the FoodItem details
}

interface Order {
  order_id: number;
  user: {
    name: string;
    email: string;
  };
  status: {
    order_status_name: string;
  };
  total_amount: string;
  created_at: string;
  order_items: OrderItem[]; // Array of OrderItems with FoodItem details
}

export default function OrderPage({ params }: { params: { slug: string } }) {
  const [orderItems, setOrderItems] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notfound, setNotFound] = useState(false);
  const router = useRouter();
  const orderId = params.slug;

  let [color, setColor] = useState("#D70040");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const fetchOrders = async () => {
    if (!orderId) return; // Exit if orderId is not set

    try {
      const response = await axios.get(`/api/admin/get/orders/${orderId}`);
      const data = response.data;

      if (data.success) {
        // Process the fetched data
        const order = data.data;

        const fetchedOrder: Order = {
          order_id: order.order_id,
          user: {
            name: order.user.name,
            email: order.user.email,
          },
          status: {
            order_status_name: order.status.order_status_name,
          },
          total_amount: order.total_amount,
          created_at: formatDate(order.created_at),
          order_items: order.order_items.map((item: any) => ({
            id: item.id,
            food_item_id: item.food_item_id,
            order_id: item.order_id,
            quantity: item.quantity,
            price: item.price,
            food_item: item.food_item, // Directly use the food_item details from response
          })),
        };

        setOrderItems(fetchedOrder);
        setNotFound(false); // Reset not found state if data is fetched
      } else {
        // Handle the case where the order is not found
        setNotFound(true);
        setOrderItems(null);
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching orders:", error);
      setNotFound(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orderId]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-dvh ">
          <HashLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="p-4">
          {notfound ? (
            <div className="flex justify-center items-center">
              <NotFound className="w-1/2 h-1/2" />
            </div>
          ) : (
            <div className="animated fadeInDown">
              {orderItems ? (
                <div>
                  <div className=" flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Order ID:{" "}
                        <span className="text-blue-600 text-2xl  font-bold antialiased ">
                          {orderItems.order_id}
                        </span>
                      </h2>
                      <p className="text-lg mb-2">
                        Customer:
                        <span className="text-blue-600 text-lg font-semibold antialiased ">
                          {orderItems.user.email}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-lg mb-2">
                        Status:{" "}
                        <Button className="bg-green-400">
                          {orderItems.status.order_status_name}
                        </Button>
                      </span>
                      <p className="text-lg mb-2">
                        Total Amount:{" "}
                        <span className="text-blue-600 text-lg font-semibold antialiased ">
                          Rs. {orderItems.total_amount}
                        </span>
                      </p>
                      <p className="text-lg mb-4 ">
                        Order Date :{" "}
                        <span className="text-blue-600 text-lg font-semibold antialiased ">
                          {orderItems.created_at}
                        </span>
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">Order Items:</h3>
                  <div className="space-y-4">
                    {orderItems.order_items.map((item) => (
                      <Card
                        key={item.id}
                        className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm"
                      >
                        <CardHeader className="flex-shrink-0">
                          <Image
                            width={200}
                            height={200}
                            className="w-48 h-48 object-cover"
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.food_item.food_images[0]}`}
                            alt={item.food_item.food_name}
                          />
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                          <CardTitle className="text-lg font-semibold mb-2">
                            {item.food_item.food_name}
                          </CardTitle>
                          <p className="text-sm text-gray-700 mb-2">
                            {truncateText(item.food_item.description, 140)}
                          </p>
                          <div className="text-lg font-semibold mb-2">
                            Rs. {item.food_item.price.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-gray-200 text-lg font-semibold">
                              Quantity: {item.quantity}
                            </span>
                            <span className="px-4 py-2 bg-gray-200 text-lg font-semibold">
                              Total: Rs.
                              {(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No order items available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
