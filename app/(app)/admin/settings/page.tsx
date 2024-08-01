"use client";
import React, { useEffect, useState } from "react";
import { AddFoodCategoryModel } from "@/components/admins/ui-models/add-food-category";
import { FoodCategoiresTable } from "@/components/admins/tables/foodCategoiresTable";
import { useAuth } from "@/hooks/auth";

const SettingPage = () => {
  const [formValues, setFormValues] = useState({
    food_category_name: "",
    food_category_description: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const { getFoodCategories } = useAuth({
    middleware: "guest",
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

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AddFoodCategoryModel
        values={formValues}
        onChange={handleInputChange}
        onSaveSuccess={fetchCategories} // Pass fetchCategories as callback
      />
      {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
      <FoodCategoiresTable categories={categories} />
    </div>
  );
};

export default SettingPage;
