import axios from "@/lib/axios";

export const getSingleOrderDetails = async (orderId: string) => {
    try {
      const response = await axios.get(
        `/api/get/products?product_id=${orderId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      throw error;
    }
  };