"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useTransition } from "react";
import { FoodCategorySchema } from "@/schemas"; // Import your validation schema
import { useNotification } from "@/app/_contexts/NotificationContext";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod"; // Import your save function
import { useAuth } from "@/hooks/auth";

interface AddFoodCategoryComponentProps {
  values: {
    food_category_name: string;
    food_category_description: string;
  };
  onChange: (field: string, value: string) => void;
  onSaveSuccess: () => void; // New prop for callback on successful save
}

export function AddFoodCategoryModel({
  values,
  onChange,
  onSaveSuccess, // Destructure the new prop
}: AddFoodCategoryComponentProps) {
  const { showNotification } = useNotification(); // Use notification context
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // State for dialog visibility

  const formMethods = useForm<z.infer<typeof FoodCategorySchema>>({
    resolver: zodResolver(FoodCategorySchema),
    defaultValues: values,
  });

  // Update the form values when values prop changes
  React.useEffect(() => {
    formMethods.reset(values);
  }, [formMethods, values]);

  const { storeFoodCategories } = useAuth({
    middleware: "guest",
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof FoodCategorySchema>) => {
    try {
      const result = await storeFoodCategories(data);

      if (result.error) {
        showNotification("Error", result.error);
      } else {
        showNotification("Success", "Food category saved successfully!");
        setIsOpen(false); // Close the dialog on success
        onSaveSuccess(); // Call the callback on success
      }
    } catch (error) {
      showNotification("Error", "Failed to save food category.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Add Food Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>...</DialogDescription>
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form
            className="space-y-4"
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={formMethods.control}
                name="food_category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Category Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("food_category_name", e.target.value);
                        }}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4">
              <div className="grid w-full gap-4">
                <FormField
                  control={formMethods.control}
                  name="food_category_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            onChange(
                              "food_category_description",
                              e.target.value
                            );
                          }}
                          placeholder="Type your message here."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Item"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
