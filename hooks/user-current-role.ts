import { useState, useEffect } from "react";
import axios from "../lib/axios";

export const useFetchUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userResponse = await axios.get("/api/user", {
          withCredentials: true,
        });
        setUserRole(userResponse.data.user_role_id);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchRole();
  }, []);

  return userRole;
};
