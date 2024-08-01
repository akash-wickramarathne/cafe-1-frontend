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
import { useTransition } from "react";
import { useNotification } from "@/app/_contexts/NotificationContext";
import { FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/auth";
import { AsignToWaiterSchema } from "@/schemas";
import axios from "@/lib/axios"; // Adjust this import based on your project structure

interface AddWaiterComponentProps {
  values: {
    waiter_id: number;
  };
  onChange: (field: string, value: string) => void;
  onSaveSuccess: () => void; // New prop for callback on successful save
}

export function AsignToWaitertoTable({
  values,
  onChange,
  onSaveSuccess,
}: AddWaiterComponentProps) {
  const { showNotification } = useNotification();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [waiters, setWaiters] = useState([]);
  const [selectedWaiter, setSelectedWaiter] = useState<number | null>(null);

  const formMethods = useForm<z.infer<typeof AsignToWaiterSchema>>({
    resolver: zodResolver(AsignToWaiterSchema),
    defaultValues: values,
  });

  // Fetch waiters when the component mounts
  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await axios.get("/api/get/waiters");
        setWaiters(response.data); // Adjust this based on your API response structure
      } catch (error) {
        console.error("Failed to fetch waiters:", error);
        showNotification("Error", "Failed to load waiters.");
      }
    };

    fetchWaiters();
  }, []);

  // Update the form values when values prop changes
  useEffect(() => {
    formMethods.reset(values);
  }, [formMethods, values]);

  const { storeWaiter } = useAuth({
    middleware: "guest",
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof AsignToWaiterSchema>) => {
    try {
      const result = await storeWaiter({ ...data, waiter_id: selectedWaiter });

      if (result.success) {
        showNotification("Success", "Waiter saved successfully!");
        setIsOpen(false); // Close the dialog on success
        onSaveSuccess(); // Call the callback on success
      } else {
        showNotification("Error", result.message || "Failed to save waiter!");
      }
    } catch (error) {
      showNotification("Error", "Failed to save Waiter.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Assign a Waiter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Waiter</DialogTitle>
          <DialogDescription>Select a waiter to assign</DialogDescription>
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form
            className="space-y-4"
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <FormControl>
              <FormLabel>Waiter</FormLabel>
              <select
                {...formMethods.register("waiter_id")}
                value={selectedWaiter || ""}
                onChange={(e) => {
                  const waiterId = Number(e.target.value);
                  setSelectedWaiter(waiterId);
                  formMethods.setValue("waiter_id", waiterId);
                }}
              >
                <option value="" disabled>
                  Select a waiter
                </option>
                {/* {waiters.map((waiter) => (
                  <option key={waiter.id} value={waiter.id}>
                    {waiter.name}
                  </option>
                ))} */}
              </select>
              <FormMessage>
                {formMethods.formState.errors.waiter_id?.message}
              </FormMessage>
            </FormControl>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Assign Waiter"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
