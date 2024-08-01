"use server";

import axios from "@/lib/axios";

export const getWaiters = async () => {
  try {
    const response = await axios.get("/api/get/waiters");
    if (!response?.data) {
      throw new Error("Failed to fetch waiters: No data in response");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching waiters:", error);
    throw error;
  }
};
