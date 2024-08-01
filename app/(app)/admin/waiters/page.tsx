"use client";
import React, { useEffect, useState } from "react";
import { AddFoodCategoryModel } from "@/components/admins/ui-models/add-food-category";
import { FoodCategoiresTable } from "@/components/admins/tables/foodCategoiresTable";
import { useAuth } from "@/hooks/auth";
import { AddWaiterModel } from "@/components/admins/ui-models/add-waiters";
import { WaitersTable } from "@/components/admins/tables/waitersTable";

const WaitersPage = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    user_id: 0,
  });
  const [waiters, setWaiters] = useState<Waiter[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const { getWaiters } = useAuth({
    middleware: "guest",
  });

  const fetchWaiters = async () => {
    try {
      const response = await getWaiters();
      const data = response;

      console.log(response);

      if (data.status) {
        const fetchedWaiters: Waiter[] = data.data.map((waiter: any) => ({
          id: waiter.id,
          name: waiter.name,
          email: waiter.email,
        }));
        setWaiters(fetchedWaiters);
      } else {
        console.error("Failed to fetch categories:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching categories:", error);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchWaiters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AddWaiterModel
        values={formValues}
        onChange={handleInputChange}
        onSaveSuccess={fetchWaiters} // Pass fetchCategories as callback
      />
      <WaitersTable waiters={waiters} />
    </div>
  );
};

export default WaitersPage;
