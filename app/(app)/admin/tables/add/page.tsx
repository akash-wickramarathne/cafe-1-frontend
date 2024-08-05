"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { AddTableSchema } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabel } from "@/components/ui/form";
import FileUpload from "@/components/admins/drag-and-drop-component";
import { storeTableImage } from "@/app/api/saveTableImage";

// Define types for statuses and sizes
type TableStatus = {
  id: number;
  status_name: string;
};

type TableSize = {
  id: number;
  size: string | null;
  description: string | null;
};

const AddBookPage = () => {
  const methods = useForm();
  const [name, setName] = useState<string>("");
  const [sizeId, setSizeId] = useState<number | "">("");
  const [statusId, setStatusId] = useState<number | "">("");
  const [seats, setSeats] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);
  const [statuses, setStatuses] = useState<TableStatus[]>([]);
  const [sizes, setSizes] = useState<TableSize[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    // Fetch statuses
    const fetchStatuses = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          data: TableStatus[];
        }>("/api/get/table/statuses");
        if (response.data.success) {
          setStatuses(response.data.data);
        } else {
          showNotification("Error", "Failed to load statuses.");
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
        showNotification("Error", "Failed to load statuses.");
      }
    };

    // Fetch sizes
    const fetchSizes = async () => {
      try {
        const response = await axios.get<{
          success: boolean;
          data: TableSize[];
        }>("/api/get/table/sizes");
        if (response.data.success) {
          setSizes(response.data.data);
        } else {
          showNotification("Error", "Failed to load sizes.");
        }
      } catch (error) {
        console.error("Failed to fetch sizes:", error);
        showNotification("Error", "Failed to load sizes.");
      }
    };

    fetchStatuses();
    fetchSizes();
  }, [showNotification]);

  const handleSubmit = async (data: any) => {
    // console.log(productImages);

    const result = AddTableSchema.safeParse(data);

    // if (!result.success) {
    //   const formattedErrors = result.error.format();
    //   setErrors(formattedErrors);
    //   showNotification("Error", "Please correct the input fields in the form.");
    //   return;
    // }

    setErrors(null);
    setLoading(true);

    if (productImages.length === 0) {
      showNotification("Error", "Please add at least one image.");
      return;
    }

    let imagePaths: string[] = [];

    if (productImages.length > 0) {
      const result = await storeTableImage(productImages);

      if (result?.success) {
        console.log("Images uploaded success", result.data);
        imagePaths = result.data;
      } else {
        console.error("Image upload failed:", result?.data);
        showNotification("Error", "Image upload failed.");
        return;
      }
    }

    try {
      const response = await axios.post<{ success: boolean; message?: string }>(
        "/api/admin/store/table",
        {
          ...data,
          size_id: sizeId !== "" ? sizeId : undefined,
          status_id: statusId !== "" ? statusId : undefined,
          seats: seats !== "" ? seats : undefined,
        }
      );

      if (response.data.success) {
        showNotification("Success", "Table added successfully.");
        setName("");
        setSizeId("");
        setStatusId("");
        setSeats("");
        setProductImages([]);
      } else {
        showNotification(
          "Error",
          response.data.message || "Failed to add table."
        );
      }
    } catch (error) {
      console.error("An error occurred while adding the table:", error);
      showNotification("Error", "An error occurred while adding the table.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add Table</h1>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <InputField
            label="Table Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors?.name?.[0]}
          />
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="size_id"
            >
              Size
            </label>
            <Select
              onValueChange={(value) => setSizeId(Number(value))}
              value={sizeId !== "" ? sizeId.toString() : ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Size</SelectLabel>
                  {sizes.map((size) => (
                    <SelectItem key={size.id} value={size.id.toString()}>
                      {size.size || `Size ${size.id}`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors?.size_id?.[0] && (
              <p className="text-red-600 text-sm mt-1">{errors.size_id[0]}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="status_id"
            >
              Status
            </label>
            <Select
              onValueChange={(value) => setStatusId(Number(value))}
              value={statusId !== "" ? statusId.toString() : ""}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Status</SelectLabel>
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.status_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {errors?.status_id?.[0] && (
              <p className="text-red-600 text-sm mt-1">{errors.status_id[0]}</p>
            )}
          </div>
          <InputField
            label="Seats"
            name="seats"
            type="number"
            value={seats}
            onChange={(e) =>
              setSeats(e.target.value ? Number(e.target.value) : "")
            }
            error={errors?.seats?.[0]}
            minVal={1}
          />
          <div className="grid gap-3">
            <FormLabel>Table Image</FormLabel>
            <FileUpload onFilesUpload={setProductImages} />
          </div>
          <Button type="submit" className="mt-4" disabled={loading}>
            {loading ? "Adding..." : "Add Table"}
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};

// Define the InputField component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  minVal,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  error?: string;
  minVal?: number;
}) => (
  <div className="mb-4">
    <label
      className="block text-sm font-medium text-gray-700 mb-1"
      htmlFor={name}
    >
      {label}
    </label>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full"
      min={minVal}
    />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

export default AddBookPage;
