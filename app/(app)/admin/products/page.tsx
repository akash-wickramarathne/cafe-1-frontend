"use client";

import { ProductSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/admins/drag-and-drop-component";
import { Button } from "@/components/ui/button";
import { storeProductImage } from "@/app/api/saveProductImge";
import { z } from "zod";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { getFoodCategories } from "@/app/api/getFoodCategoires";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storeFood } from "@/app/api/storeFoodItem";
import { useRouter } from "next/navigation";

// Define the type based on your schema

export default function Dashboard() {
  const [isPending, setIsPending] = useState(false);
  const [productImages, setProductImages] = useState<File[]>([]);
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const router = useRouter();

  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      // category: 1,
      stock: 0,
      imagePaths: [],
    },
  });
  const fetchCategories = async () => {
    try {
      const response = await getFoodCategories();
      const data = response;

      console.log(response);

      if (data.status) {
        const fetchedCategories: Category[] = data.data.map(
          (category: any) => ({
            id: category.id,
            name: category.name,
            totalItems: category.totalItems,
          })
        );
        setCategories(fetchedCategories);
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const { handleSubmit, control, reset } = formMethods;
  const submitForm: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      // Convert price and stock to appropriate types
      data.price = parseFloat(data.price.toString());
      data.stock = parseInt(data.stock.toString(), 10);

      // Ensure at least one image is selected
      if (productImages.length === 0) {
        showNotification("Error", "You should select at least one image");
        return;
      }

      let imagePaths: string[] = [];

      // Upload images if any are selected
      if (productImages.length > 0) {
        const result = await storeProductImage(productImages);

        if (result?.success) {
          console.log("Images uploaded successfully:", result.paths);
          imagePaths = result.paths; // Use the result paths directly
        } else {
          console.error("Image upload failed:", result?.message);
          showNotification("Error", "Image upload failed.");
          return;
        }
      }

      // Prepare payload for storing product
      const payload: ProductFormValues = {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        imagePaths: imagePaths, // Ensure it matches the expected type
      };

      // Store the product
      const result = await storeFood(payload);
      if (result.success) {
        router.push("/some-page");
        showNotification("Success", "Product created successfully.");
      } else {
        showNotification("Error", "Failed to create product.");
      }
      console.log(result);
    } catch (error) {
      console.error("Submission error:", error);
      showNotification("Error", "Submission error.");
    } finally {
      setIsPending(false);
    }
  };

  const handleFormSubmit = () => {
    console.log("Handle Form Submit called"); // Debug message
    handleSubmit(submitForm)(); // Manually trigger form submission
  };

  const handleImageUpload = async () => {
    try {
      setIsPending(true);

      if (productImages.length > 0) {
        const result = await storeProductImage(productImages);
        console.log(result);
        console.log("Images uploaded successfully:", result.paths);
      } else {
        console.log("No images to upload");
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col">
      <main className="grid flex-1 gap-4 overflow-auto">
        <div className="relative hidden flex-col items-start gap-8 md:flex">
          <FormProvider {...formMethods}>
            <form className="grid w-full items-start bg-white gap-6">
              <fieldset className="gap-6 rounded-lg border p-4 grid grid-cols-2">
                <div>
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Features
                  </legend>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Food"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={isPending}
                              placeholder="Type Something about product"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
                              type="number"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Stock</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder=""
                              type="number"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Category</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.toString() || "placeholder"} // Default to "placeholder" when no value is selected
                              onValueChange={(value) => {
                                if (value === "placeholder") {
                                  field.onChange(null); // Clear the value if placeholder is selected
                                } else {
                                  field.onChange(Number(value)); // Convert string to number for other options
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Food Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder" disabled>
                                  Select Food Category
                                </SelectItem>{" "}
                                {/* Placeholder option with a unique value */}
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()} // Ensure value is a string
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <FormLabel>Product Image</FormLabel>
                  <FileUpload onFilesUpload={setProductImages} />
                </div>
                <Button
                  type="button"
                  onClick={handleFormSubmit}
                  className="w-full mt-2"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </fieldset>
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  );
}
function fetchCategories() {
  throw new Error("Function not implemented.");
}
