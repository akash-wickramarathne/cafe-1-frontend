import axios from "@/lib/axios";
import { wishlistSchema } from "@/schemas";
import { z } from "zod"; // Import the defined types

export const addWishlist = async (values: z.infer<typeof wishlistSchema>) => {
  const validateFields = wishlistSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid fields",
      details: validateFields.error.format(),
    };
  }

  try {
    const response = await axios.post(
      "/api/client/add/wishlist/product",
      validateFields.data // Send only the validated data
    );

    if (!response?.data) {
      throw new Error("Failed to update wishlist: No data in response");
    }
    return response.data;
  } catch (error) {
    console.error("Error update wishlist:");
  }
};
