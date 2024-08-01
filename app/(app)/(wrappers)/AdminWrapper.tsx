"use client";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { CSSProperties } from "react";
import DotLoader from "react-spinners/DotLoader";
const AdminWrapper = ({ children }: any) => {
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
    return <div>You dont have access {userRole}</div>;
  }
};

export default AdminWrapper;
