import axios from "@/lib/axios";

// Function to store product images
export const storeTableImage = async (images: File[]) => {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // Append images to FormData
    images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // Make the POST request with FormData
    const response = await axios.post("/api/admin/store/table/image", formData);
    console.log(response);

    // Handle successful response
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    // Handle error
    console.error("Error uploading images:", error);
    throw error;
  }
};
