"use client";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
export default function AdvanceFilters({
  title,
  minPrice,
  maxPrice,
  sortOption,
  setMinPrice,
  setMaxPrice,
  setSortOption,
  selectedCategory,
  setSelectedCategory,
  handleApplyFilters,
}) {
  const [productCategories, SetProductCategories] = useState([]);

  const handleSelectSortChange = (value: string) => {
    setSortOption(value);
  };
  const handleSelectCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await axios.get("/api/get/foodCategoires");
        SetProductCategories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch product brands:", error);
      }
    };
    fetchProductCategories();
  }, []);

  return (
    <aside className="p-2 bg-white h-screen flex flex-col justify-between">
      <div>
        <div className="">
          <h2 className="font-bold antialiased text-4xl text-center">
            {title}
          </h2>
          <div className="menu rounded-box p-5 flex flex-col gap-y-5 ">
            <div>
              <Label>Min Price</Label>
              <Input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input"
                type="number"
                min="0"
                placeholder="Min Price"
              />
            </div>
            <div>
              <Label>Max Price</Label>
              <Input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input"
                type="number"
                min="1"
                placeholder="Max Price"
              />
            </div>

            <div>
              <Label>Sort By</Label>
              <Select value={sortOption} onValueChange={handleSelectSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="price:asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price:desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="name:asc">Name: A to Z</SelectItem>
                    <SelectItem value="name:desc">Name: Z to A</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={handleSelectCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {productCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <Button className=" w-full " onClick={handleApplyFilters}>
          Apply
        </Button>
      </div>
    </aside>
  );
}
