"use server";

import axios from "@/lib/axios";
import { getCartSchema } from "@/schemas";
import { z } from "zod";

export const getCartItems = async (values: z.infer<typeof getCartSchema>) => {
  const validateFields = getCartSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid fields",
      details: validateFields.error.format(),
    };
  }
  try {
    const response = await axios.post(
      "/api/client/get/cart/all",
      validateFields.data
    );
    if (!response?.data) {
      throw new Error("Failed to fetch cart: No data in response");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};
