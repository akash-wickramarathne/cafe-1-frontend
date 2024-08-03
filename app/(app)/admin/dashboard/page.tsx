"use client";
import { useState, useEffect, CSSProperties } from "react";
import { useNotification } from "@/app/_contexts/NotificationContext";
import AdminLayout from "../layout";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/lib/axios";
import SingleStatic from "@/components/admins/SingleStatic";
import SingleStaticRow from "@/components/admins/SingleRowStatic";
import BestSellingProducts from "@/components/admins/SingleRowStatic";
import RingLoader from "react-spinners/RingLoader";

const AdminDashboardPage = () => {
  const { showNotification } = useNotification();
  const { toast } = useToast();

  // Define states to hold the data
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [waiterCount, setWaiterCount] = useState<number | null>(null);
  const [tableCount, setTableCount] = useState<number | null>(null);
  const [foodCategoryCount, setFoodCategoryCount] = useState<number | null>(
    null
  );
  const [bestSellingProduct, setBestSellingProduct] = useState([]);
  const [ordersPayAmount, setOrdersPayAmount] = useState<number | null>(null);
  const [tablePayAmount, setTablePayAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  let [color, setColor] = useState("#D70040");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  // Function to fetch data from the APIs
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        clientResponse,
        orderResponse,
        productResponse,
        waiterResponse,
        tableResponse,
        foodCategoryResponse,
        ordersPayResponse,
        tablePayResponse,
        bestSellingProductResponse,
      ] = await Promise.all([
        axios.get("/api/admin/dashboard/count/clients"),
        axios.get("/api/admin/dashboard/count/orders"),
        axios.get("/api/admin/dashboard/count/products"),
        axios.get("/api/admin/dashboard/count/waiters"),
        axios.get("/api/admin/dashboard/count/tables"),
        axios.get("/api/admin/dashboard/count/foodCategories"),
        axios.get("/api/admin/dashboard/amount/orders"),
        axios.get("/api/admin/dashboard/amount/tables"),
        axios.get("/api/get/best-selling/product"),
      ]);

      // Set state with the fetched data
      setClientCount(clientResponse.data.data);
      setOrderCount(orderResponse.data.data);
      setProductCount(productResponse.data.data);
      setWaiterCount(waiterResponse.data.data);
      setTableCount(tableResponse.data.data);
      setFoodCategoryCount(foodCategoryResponse.data.data);
      setOrdersPayAmount(ordersPayResponse.data.data);
      setTablePayAmount(tablePayResponse.data.data);
      setBestSellingProduct(bestSellingProductResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification("error", "Failed to fetch dashboard data.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handler for button click (for notification)
  const handleClick = () => {
    showNotification("success", "This is a notification message!");
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <RingLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="space-y-4 animated fadeInDown  ">
          {/* Pass values to SingleStatic component */}
          <div className="grid grid-cols-4 gap-4 w-full">
            <SingleStatic
              title="Clients Count"
              data={clientCount ?? "Loading..."}
              className="p-4 bg-white shadow rounded"
              imageSrc="/admin/static1.jpg"
            />
            <SingleStatic
              title="Product Count"
              data={productCount ?? "Loading..."}
              className="p-4 bg-white shadow rounded"
              imageSrc="/admin/static1.jpg"
            />
            <SingleStatic
              title="Orders Payment Amount"
              data={`$${ordersPayAmount ?? "Loading..."}`}
              className="p-4 bg-white shadow rounded"
              imageSrc="/admin/static1.jpg"
            />
            <SingleStatic
              title="Tables Payment Amount"
              data={`$${tablePayAmount ?? "Loading..."}`}
              className="p-4 bg-white shadow rounded"
              imageSrc="/admin/static1.jpg"
            />
          </div>

          <div className="grid grid-cols-1">
            <BestSellingProducts />
          </div>

          {/* <button
        onClick={handleClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Show Notification
      </button>

      <div>
        <h2 className="text-2xl font-bold">Dashboard Data</h2>
        <p>Clients Count: {clientCount ?? "Loading..."}</p>
        <p>Orders Count: {orderCount ?? "Loading..."}</p>
        <p>Products Count: {productCount ?? "Loading..."}</p>
        <p>Waiters Count: {waiterCount ?? "Loading..."}</p>
        <p>Tables Count: {tableCount ?? "Loading..."}</p>
        <p>Food Categories Count: {foodCategoryCount ?? "Loading..."}</p>
        <p>Orders Payment Amount: ${ordersPayAmount ?? "Loading..."}</p>
      </div> */}
        </div>
      )}
    </>
  );
};

export default AdminDashboardPage;
