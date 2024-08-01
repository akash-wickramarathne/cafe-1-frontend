"use server";

import axios from "@/lib/axios";

export const getFoods = async () => {
  try {
    const response = await axios.get("/api/get/products");
    if (!response?.data) {
      throw new Error("Failed to fetch food : No data in response");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching food :", error);
    throw error;
  }
};
