"use client";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { CSSProperties } from "react";
import DotLoader from "react-spinners/DotLoader";
import animationData from "../../../public/admin/not-auth.json";
import Lottie from "lottie-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const AdminWrapper = ({ children }: any) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  let [color, setColor] = useState("#D70040");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userResponse = await axios.get("/api/user-role", {
          withCredentials: true,
        });
        setUserRole(userResponse.data);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height
        }}
      >
        <DotLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (userRole === 3 || userRole === 2) {
    return <>{children}</>;
  } else {
    return (
      <div className="flex justify-center items-center  min-h-screen">
        <div className="bg-white rounded-lg shadow-md flex flex-col items-center w-1/2 space-y-10 p-20 ">
          <Lottie
            animationData={animationData}
            className=" w-1/3"
            loop={true}
          />
          <h1 className="text-3xl font-bold mb-4 animate-pulse ">
            Forbidden Access
          </h1>
          <Button
            className=""
            onClick={() => {
              router.back();
            }}
          >
            Back Again
          </Button>
        </div>
      </div>
    );
  }
};

export default AdminWrapper;
