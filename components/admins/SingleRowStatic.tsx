"use client";

import axios from "@/lib/axios";
import React, { useEffect, useState } from "react"; // Adjust the path if needed

const BestSellingProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the best-selling product details
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/get/best-selling/product"); // Replace with your actual API endpoint
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  const baseUrl = "http://localhost:8000/storage";
  return (
    <div className="w-full p-6 bg-white shadow-md rounded-lg">
      <h1 className="font-bold text-2xl mb-4">Best Selling Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name}
            imageSrc={`${baseUrl}/${product.foodImages[0]}`}
            count={product.orderCount}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;

const ProductCard = ({
  title,
  imageSrc,
  count,
}: {
  title: string;
  imageSrc: string;
  count: number;
}) => {
  return (
    <div className="flex flex-col items-center p-4 ">
      {/* Image */}
      <img
        src={imageSrc}
        alt={title}
        className="w-32 h-32 rounded-full border border-gray-300 object-cover mb-2"
      />
      {/* Product Name */}
      <p className="text-lg font-semibold text-center">{title}</p>
      <p className="text-indigo-600" > Selles Count - {count} </p>
    </div>
  );
};
