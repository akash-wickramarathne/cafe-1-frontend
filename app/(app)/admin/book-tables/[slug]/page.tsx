"use client";

import { CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import NotFound from "@/app/(app)/notfound";
import { Button } from "@/components/ui/button";
import HashLoader from "react-spinners/HashLoader";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotification } from "@/app/_contexts/NotificationContext";

// Updated User interface
interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  user_role_id: number;
}

// Updated BookingStatus interface
interface BookingStatus {
  order_status_id: number;
  order_status_name: string;
}

// Updated Waiter interface
interface Waiter {
  waiter_id: number;
  name: string;
  email: string;
  phone: string;
  user_id: number;
  profile_image?: string | null;
}

// Updated Booking interface
interface Booking {
  id: number;
  created_at: string;
  updated_at: string;
  start_time: string;
  end_time: string;
  table_status_id: number;
  waiter_id?: number | null;
  payment: string;
  book_date: string;
  user_id: number;
  stripe_session_id?: string | null; // Made optional as per the response
  user: User;
  status: BookingStatus;
  waiter?: Waiter; // Made optional to handle cases where waiter may be null
}

export default function BookingPage({ params }: { params: { slug: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notfound, setNotFound] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState<number | null>(null);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const router = useRouter();
  const bookingId = params.slug;
  const { showNotification } = useNotification();

  const color = "#D70040"; // Simplified state for color
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  // Fetch booking details
  const fetchBooking = async () => {
    if (!bookingId) return; // Exit if bookingId is not set

    try {
      const response = await axios.get(
        `/api/admin/get/book-tables/${bookingId}`
      );
      const data = response.data;

      if (data.success) {
        const booking = data.data;

        const fetchedBooking: Booking = {
          id: booking.id,
          created_at: formatDate(booking.created_at),
          updated_at: formatDate(booking.updated_at),
          start_time: booking.start_time,
          end_time: booking.end_time,
          table_status_id: booking.table_status_id,
          waiter_id: booking.waiter_id,
          payment: booking.payment,
          book_date: formatDate(booking.book_date),
          user_id: booking.user_id,
          stripe_session_id: booking.stripe_session_id ?? null,
          user: {
            id: booking.user.id,
            name: booking.user.name,
            email: booking.user.email,
            phone_number: booking.user.phone_number,
            email_verified_at: booking.user.email_verified_at,
            created_at: formatDate(booking.user.created_at),
            updated_at: formatDate(booking.user.updated_at),
            user_role_id: booking.user.user_role_id,
          },
          status: {
            order_status_id: booking.status.order_status_id,
            order_status_name: booking.status.order_status_name,
          },
          waiter: booking.waiter ?? undefined, // Handle optional waiter
        };

        setBooking(fetchedBooking);
        setNotFound(false);
      } else {
        setNotFound(true);
        setBooking(null);
        console.error("Failed to fetch booking:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching booking:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch waiters
  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await axios.get("/api/get/waiters");
        setWaiters(response.data.data);
      } catch (error) {
        console.error("Failed to fetch waiters:", error);
        showNotification("Error", "Failed to load waiters.");
      }
    };

    fetchWaiters();
  }, []);

  // Fetch booking on component mount and when bookingId changes
  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  // Handle waiter assignment
  const handleSelectChange = (value: string) => {
    const selectedId = parseInt(value);
    setSelectedWaiter(selectedId);
  };

  const handleSave = async () => {
    if (booking && selectedWaiter !== null) {
      try {
        await axios.post("/api/admin/assign-waiter", {
          tableId: booking.id,
          waiterId: selectedWaiter,
        });
        showNotification("Success", "Waiter assigned successfully.");
        fetchBooking(); // Refresh booking details
      } catch (error) {
        console.error("Failed to assign waiter:", error);
        showNotification("Error", "Failed to assign waiter.");
      }
    } else {
      showNotification("Warning", "Please select a waiter.");
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-dvh">
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
              {booking ? (
                <div>
                  <div className="flex flex-col">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Booking ID:{" "}
                        <span className="text-blue-600 text-2xl font-bold antialiased">
                          {booking.id}
                        </span>
                      </h2>
                      <p className="text-lg mb-2">
                        Customer:
                        <span className="text-blue-600 text-lg font-semibold antialiased">
                          {booking.user.email}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-lg mb-2">
                        Status:{" "}
                        <Button className="bg-green-400">
                          {booking.status.order_status_name}
                        </Button>
                      </span>
                      <p className="text-lg mb-2">
                        Payment:{" "}
                        <span className="text-blue-600 text-lg font-semibold antialiased">
                          Rs. {booking.payment}
                        </span>
                      </p>
                      <p className="text-lg mb-4">
                        Booking Date :{" "}
                        <span className="text-blue-600 text-lg font-semibold antialiased">
                          {booking.book_date}
                        </span>
                      </p>
                      <p className="text-lg mb-4">
                        Start Time :{" "}
                        <span className="text-blue-600 text-lg font-semibold antialiased">
                          {booking.start_time}
                        </span>
                      </p>
                      <p className="text-lg mb-4">
                        End Time :{" "}
                        <span className="text-blue-600 text-lg font-semibold antialiased">
                          {booking.end_time}
                        </span>
                      </p>
                      {booking.waiter ? (
                        <p className="text-lg mb-4">
                          Waiter Name :{" "}
                          <span className="text-blue-600 text-lg font-semibold antialiased">
                            {booking.waiter.name}
                          </span>
                        </p>
                      ) : (
                        <div className="flex justify-center">
                          <div>
                            <Select
                              onValueChange={handleSelectChange}
                              value={
                                selectedWaiter !== null
                                  ? String(selectedWaiter)
                                  : ""
                              }
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Assign a waiter" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Assign a waiter</SelectLabel>
                                  {waiters.map((waiter) => (
                                    <SelectItem
                                      value={waiter.waiter_id.toString()}
                                      key={waiter.waiter_id}
                                    >
                                      {waiter.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <Button onClick={handleSave} className="mt-2">
                              Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No booking details available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
