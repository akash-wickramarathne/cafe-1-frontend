"use server";

import axios from "@/lib/axios";

export const getBookTables = async () => {
  try {
    const response = await axios.get("/api/admin/get/book-table");
    if (!response?.data) {
      throw new Error("Failed to fetch book tables: No data in response");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching book tables:", error);
    throw error;
  }
};
