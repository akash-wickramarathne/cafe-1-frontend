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
import { WaiterSchema } from "@/schemas";

interface AddWaiterComponentProps {
  values: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  };
  onChange: (field: string, value: string) => void;
  onSaveSuccess: () => void; // New prop for callback on successful save
}

export function AddWaiterModel({
  values,
  onChange,
  onSaveSuccess, // Destructure the new prop
}: AddWaiterComponentProps) {
  const { showNotification } = useNotification(); // Use notification context
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false); // State for dialog visibility

  const formMethods = useForm<z.infer<typeof WaiterSchema>>({
    resolver: zodResolver(WaiterSchema),
    defaultValues: values,
  });

  // Update the form values when values prop changes
  React.useEffect(() => {
    formMethods.reset(values);
  }, [formMethods, values]);

  const { storeWaiter } = useAuth({
    middleware: "guest",
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof WaiterSchema>) => {
    try {
      const result = await storeWaiter(data);

      console.log(result);
      if (result.success) {
        showNotification("Success", "Waiter saved successfully!");
      }
      if (result.message) {
        showNotification("Error", result.message);
      } else {
        showNotification("Error", "Failed to save waiter!");
      }
      if (result.error) {
        showNotification("Error", result.error);
      } else {
        setIsOpen(false); // Close the dialog on success
        onSaveSuccess(); // Call the callback on success
      }
    } catch (error) {
      showNotification("Error", "Failed to save Waiter.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Add Waiter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Waiter</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form
            className="space-y-4"
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={formMethods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("name", e.target.value);
                        }}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("email", e.target.value);
                        }}
                        className="col-span-3"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("phone", e.target.value);
                        }}
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange("password", e.target.value);
                        }}
                        className="col-span-3"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Waiter"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
