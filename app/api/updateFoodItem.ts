import axios from "@/lib/axios";

export const updateFood = async (
  productId: string,
  data: ProductFormValues
) => {
  try {
    const response = await axios.put(
      `/api/admin/product/edit/${productId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
};
