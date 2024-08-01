"use client";

import Header2 from "@/components/clients/Header2";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

const BookTablePage = () => {
  const router = useRouter();
  const today = new Date();

  const [formData, setFormData] = useState({
    date: today.toISOString().split("T")[0], // Set default date to today
    start_time: "",
    end_time: "",
  });
  const [showPayButton, setShowPayButton] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckAvaiableClick = async () => {
    setShowPayButton(false);
    console.log(formData);
    try {
      const response = await checkAvaibleBookTables(formData);
      console.log(response); // Access response data
      if (response.success) {
        setShowPayButton(true);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      // Optionally, show an error message to the user
    }
  };
  const handleGotoPayClick = async () => {
    console.log(formData);
    try {
      const queryParams = new URLSearchParams(formData).toString(); // Convert formData to query string
      router.push(`book-table/pay/?${queryParams}`);
    } catch (error) {
      console.error("Error checking availability:", error);
      // Optionally, show an error message to the user
    }
  };

  const checkAvaibleBookTables = async (formData: any) => {
    const response = await axios.post(
      "/api/check-availability/table",
      formData
    );
    return response.data;
  };

  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 1); // Set max date to one month from today

  // Calculate min start time
  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const minStartTime =
    today.getDate() === new Date(formData.date).getDate()
      ? `${currentHour}:${
          (currentMinutes + 5 < 10 ? "0" : "") + (currentMinutes + 5)
        }`
      : "00:00"; // Default min start time for other days

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
              <CardTitle className="text-center">Book a Table</CardTitle>
              <CardDescription className="text-center">
                Enjoy with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="date">Select Booking Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      placeholder="Select the booking date"
                      value={formData.date}
                      min={today.toISOString().split("T")[0]} // Set min to today
                      max={maxDate.toISOString().split("T")[0]} // Set max to one month from today
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="startTime">Select Booking Start Time</Label>
                    <Input
                      id="startTime"
                      name="start_time"
                      type="time"
                      placeholder="Select the booking start time"
                      value={formData.start_time}
                      min={minStartTime} // Set min to now + 5 minutes if today
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="endTime">Select Booking End Time</Label>
                    <Input
                      id="endTime"
                      name="end_time"
                      type="time"
                      placeholder="Select the booking end time"
                      value={formData.end_time}
                      min={formData.start_time || undefined} // Set min to start time if available
                      disabled={!formData.start_time} // Disable if start time is empty
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={handleCheckAvaiableClick} className="w-full">
                Check
              </Button>
              {showPayButton && ( // Conditionally render the Pay button
                <Button onClick={handleGotoPayClick} className="w-full">
                  Pay
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookTablePage;
