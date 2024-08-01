"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import Lottie from "lottie-react";
import animationData from "../../../public/payment/payment-success.json";
import { Button } from "@/components/ui/button";

const PaymentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLeaving, setIsLeaving] = useState(false);

  const updatePaymentStatus = async (sessionId: string, type: string) => {
    try {
      const response = await axios.post("/api/client/update-payment-status", {
        stripe_session_id: sessionId,
        type: type,
      });
      console.log("Payment status updated:", response.data);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  useEffect(() => {
    const session_id = searchParams.get("session_id");
    const type = searchParams.get("type");
    console.log(type);
    console.log("Session ID:", session_id);
    if (session_id && type) {
      updatePaymentStatus(session_id, type);
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isLeaving) {
        event.preventDefault();
        event.returnValue = ""; // For older browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLeaving, searchParams]);

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      if (!window.confirm("Do you want to leave this page?")) {
        // Prevent navigation
        // router.replace(router.pathname + router.search);
      } else {
        setIsLeaving(true);
      }
    };

    // router.events?.on("routeChangeStart", handleRouteChange);
    // return () => {
    //   router.events?.off("routeChangeStart", handleRouteChange);
    // };
  }, [router]);

  return (
    <div className="flex justify-center items-center  min-h-screen">
      <div className="bg-white rounded-lg shadow-md flex flex-col items-center p-4 ">
        <Lottie animationData={animationData} className=" w-1/3" loop={true} />
        <h1 className="text-3xl font-bold mb-4 animate-pulse text-green-500 ">
          Payment SuccessFully
        </h1>
        <Button
          onClick={() => {
            router.push("/search");
          }}
        >
          Back to Shop
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
