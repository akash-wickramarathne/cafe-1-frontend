import axios from "@/lib/axios";
import { FoodCategorySchema } from "@/schemas";
import { z } from "zod"; // Import the defined types

export const saveBookPayment = async (values: any) => {
  //const validateFields = FoodCategorySchema.safeParse(values);

  if (!values) {
    return {
      error: "Invalid fields",
      // details: validateFields.error.format(),
    };
  }

  try {
    // Ensure CSRF token is fetched
    //  await axios.get("/sanctum/csrf-cookie");

    const response = await axios.post(
      "/api/client/make-payment/table",
      values // Send only the validated data
    );

    if (!response?.data) {
      throw new Error("Failed to save food category: No data in response");
    }
    return response.data;
  } catch (error) {
    // Use type assertion to cast the error to AxiosError
    //  const axiosError = error as AxiosError;
    // console.error("Error saving food category:", axiosError);
    // Safely access properties using optional chaining and nullish coalescing
  }
};
