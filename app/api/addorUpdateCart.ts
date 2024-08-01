import axios from "@/lib/axios";
import { cartSchema } from "@/schemas";
import { z } from "zod"; // Import the defined types

export const AddorUpdateCart = async (values: z.infer<typeof cartSchema>) => {
  const validateFields = cartSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      error: "Invalid fields",
      details: validateFields.error.format(),
    };
  }

  try {
    const response = await axios.post(
      "/api/client/add/cart/product",
      validateFields.data // Send only the validated data
    );

    if (!response?.data) {
      throw new Error("Failed to update cart: No data in response");
    }
    return response.data;
  } catch (error) {
    console.error("Error update cart:");
  }
};
