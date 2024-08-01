"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdvanceFilters from "@/components/clients/AdvanceFilter";
import Header2 from "@/components/clients/Header2";
import SearchPageHeader from "@/components/clients/SearchPageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchPageLayout = ({ children }: any) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("price:asc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const navigate = useRouter();

  const handleApplyFilters = () => {
    let newUrl = "";

    if (minPrice) {
      newUrl += "minPrice=" + encodeURIComponent(minPrice);
    }

    if (maxPrice) {
      if (newUrl) {
        newUrl += "&";
      }
      newUrl += "maxPrice=" + encodeURIComponent(maxPrice);
    }

    if (searchText) {
      if (newUrl) {
        newUrl += "&";
      }
      newUrl += "query=" + encodeURIComponent(searchText);
    }
    if (sortOption) {
      if (newUrl) {
        newUrl += "&";
      }
      newUrl += "sort=" + encodeURIComponent(sortOption);
    }
    if (selectedCategory !== "0") {
      if (newUrl) {
        newUrl += "&";
      }
      newUrl += "category_id=" + encodeURIComponent(selectedCategory);
    }

    navigate.push("/search?" + newUrl);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchClick = () => {
    handleApplyFilters();
  };

  return (
    <div className="flex justify-between h-screen">
      <div className="bg-gray-100 w-2/12">
        <AdvanceFilters
          title="Filters"
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortOption={sortOption}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          setSortOption={setSortOption}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          handleApplyFilters={handleApplyFilters}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </div>
      <div className="h-screen w-10/12">
        <div className="h-[80px] flex justify-between items-center p-8 gap-3">
          <Input
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search Here.."
            className=""
          />
          <Button onClick={handleSearchClick}>Search</Button>
        </div>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
};

export default SearchPageLayout;
