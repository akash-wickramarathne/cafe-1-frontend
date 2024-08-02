"use client";

import { SingleProductCard } from "@/components/common/SingleProductCard";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const fetchProducts = async () => {
    try {
      //const response = await getFoods();
      const response = await axios.get("/api/get/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const navigate = useRouter();
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleGoToEditProduct = (product: Product) => {
    navigate.push(`edit/${product.id}`);
  };
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <SingleProductCard
            key={product.id}
            product={product}
            handleEditClick={() => {
              handleGoToEditProduct(product);
            }}
            // handleCartClick={(quantity) =>
            //   addToCart(product.id.toString(), quantity)
            // }
            // handleWishslitClick={() =>
            //   addToWishlist(product.id.toString())
            // }
          />
        ))}
      </div>
    </div>
  );
};

export default EditProductPage;
