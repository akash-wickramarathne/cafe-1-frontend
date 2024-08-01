"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Header2 from "@/components/clients/Header2";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveBookPayment } from "@/app/api/saveBookPayment";
import { useNotification } from "@/app/_contexts/NotificationContext";

const PayToTableBook = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [data, setData] = useState({
    start_time: "",
    end_time: "",
    date: "",
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const dateParam = searchParams.get("date");
    const start_timeParam = searchParams.get("start_time");
    const end_timeParam = searchParams.get("end_time");

    const validateParams = () => {
      console.log("Validating params:", {
        dateParam,
        start_timeParam,
        end_timeParam,
      });

      if (!dateParam || !start_timeParam || !end_timeParam) {
        router.push("/book-table");
        return;
      }

      const today = new Date();
      const bookingDate = new Date(dateParam);

      const validDateRange = new Date(today);
      validDateRange.setDate(validDateRange.getDate() + 7);

      const [startHours, startMinutes] = start_timeParam.split(":").map(Number);
      const [endHours, endMinutes] = end_timeParam.split(":").map(Number);
      const currentDate = today.toISOString().split("T")[0];

      if (
        dateParam === currentDate &&
        (endHours < startHours ||
          (endHours === startHours && endMinutes <= startMinutes))
      ) {
        router.push("/book-table");
        return;
      }

      if (
        dateParam === currentDate &&
        (today.getHours() > endHours ||
          (today.getHours() === endHours && today.getMinutes() > endMinutes))
      ) {
        router.push("/book-table");
        return;
      }

      setDate(dateParam);
      setStartTime(start_timeParam);
      setEndTime(end_timeParam);
      setData({
        date: dateParam,
        start_time: start_timeParam,
        end_time: end_timeParam,
      });
      setLoading(false);
    };

    validateParams();
  }, [router]);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await saveBookPayment(data);
      if (response && response.url) {
        router.push(response.url);
      } else {
        showNotification("Error", "Payment initiation failed.");
        // setError("Payment initiation failed.");
      }
    } catch (error) {
      showNotification("Error", "An error occurred while processing payment.");
      //setError("An error occurred while processing payment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="h-screen bg-center bg-cover"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <Header2 />
      <div className="flex flex-col justify-center items-center h-5/6">
        <div>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle className="text-center">Pay to Book Table</CardTitle>
              <CardDescription className="text-center">
                Enjoy with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="date">Booking Date</Label>
                    <p>{date}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="startTime">Booking Start Time</Label>
                    <p>{startTime}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="endTime">Booking End Time</Label>
                    <p>{endTime}</p>
                  </div>
                </div>
              </form>
            </CardContent>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <CardFooter className="flex justify-center">
              <Button className="w-full" onClick={handlePayment}>
                Pay
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PayToTableBook;
