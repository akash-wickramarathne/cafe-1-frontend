"use client";

import { SingleProductCard } from "@/components/common/SingleProductCard";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import React, { CSSProperties, useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";

const EditProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#D70040");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const fetchProducts = async () => {
    try {
      //const response = await getFoods();
      const response = await axios.get("/api/get/products");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
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
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <HashLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {products.map((product) => (
            <div className="animated fadeInDown" key={product.id}>
              <SingleProductCard
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditProductPage;
