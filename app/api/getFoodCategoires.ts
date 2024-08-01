"use server";

import axios from "@/lib/axios";

export const getFoodCategories = async () => {
  try {
    const response = await axios.get("/api/get/foodCategoires");
    if (!response?.data) {
      throw new Error("Failed to fetch food categories: No data in response");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching food categories:", error);
    throw error;
  }
};
