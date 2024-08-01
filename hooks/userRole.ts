import { useState, useEffect } from "react";
import axios from "../lib/axios";

export const useUserRole = async () => {
  const userResponse = await axios.get("/api/user", { withCredentials: true });
  return userResponse.data.user_role_id;
};
