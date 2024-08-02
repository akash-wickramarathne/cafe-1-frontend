"use client";

import { ProductSchema } from "@/schemas";
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

import { useRouter } from "next/navigation";
import { getProductDetails } from "@/app/api/getFoods";
import { updateFood } from "@/app/api/updateFoodItem";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditProduct({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const [isPending, setIsPending] = useState(false);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { showNotification } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const router = useRouter();
  const productId = params.slug;

  const formMethods = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: 0,
      imagePaths: [],
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await getFoodCategories();
      const data = response;

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

  const fetchProductDetails = async () => {
    try {
      const response = await getProductDetails(productId);
      if (response.success) {
        const product = response.data;
        reset({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category.id,
          imagePaths: product.foodImages,
        });
        setUploadedImageUrls(product.foodImages);
        setExistingImages(product.foodImages);
      } else {
        showNotification("Error", "Failed to fetch product details.");
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      showNotification("Error", "Failed to fetch product details.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductDetails();
  }, [productId]);

  const { handleSubmit, control, reset } = formMethods;
  const submitForm: SubmitHandler<ProductFormValues> = async (data) => {
    try {
      setIsPending(true);
      data.price = parseFloat(data.price.toString());
      data.stock = parseInt(data.stock.toString(), 10);

      // Combine old image URLs with new uploaded images
      const finalImagePaths = [
        ...uploadedImageUrls,
        ...productImages.map((file) => URL.createObjectURL(file)),
      ];

      if (productImages.length > 0) {
        const result = await storeProductImage(productImages);
        if (result?.success) {
          finalImagePaths.push(...result.paths);
        } else {
          showNotification("Error", "Image upload failed.");
          return;
        }
      }

      data.imagePaths = finalImagePaths; // Set the combined image paths here

      const result = await updateFood(productId, data);
      if (result.success) {
        showNotification("Success", "Product updated successfully.");
      } else {
        showNotification("Error", "Failed to update product.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showNotification("Error", "Submission error.");
    } finally {
      setIsPending(false);
    }
  };

  const handleFilesUpload = (newFiles: File[], existingUrls: string[]) => {
    setProductImages(newFiles);
    setExistingImages(existingUrls);
  };

  const handleFormSubmit = () => {
    handleSubmit(submitForm)();
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
                              value={field.value?.toString() || "placeholder"}
                              onValueChange={(value) => {
                                if (value === "placeholder") {
                                  field.onChange(null);
                                } else {
                                  field.onChange(Number(value));
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Food Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder" disabled>
                                  Select Food Category
                                </SelectItem>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
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
                  <FileUpload
                    onFilesUpload={(newFiles, existingImages) => {
                      setProductImages(newFiles); // Update to the newly uploaded files
                      setUploadedImageUrls(existingImages); // Keep existing image URLs
                    }}
                    defaultImages={uploadedImageUrls}
                  />
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
