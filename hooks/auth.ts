import useSWR from "swr";
import axios from "../lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { storeFoodCategories as storeFoodCategoriesService } from "@/app/api/saveFoodCategory";
import { getFoodCategories as getFoodCategoiresService } from "@/app/api/getFoodCategoires";
import { getCartItems as getCartItemsService } from "@/app/api/getCartItems";
import { storeWaiter as storeWaiterService } from "@/app/api/saveWaiter";
import { saveBookPayment as saveBookPaymentService } from "@/app/api/saveBookPayment";
import { getWaiters as getWaitersService } from "@/app/api/getWaiters";
import { getBookTables as getBookTablesService } from "@/app/api/getBookTables";

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware?: any;
  redirectIfAuthenticated?: any;
} = {}) => {
  const router = useRouter();
  const params = useParams();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({
    setErrors,
    ...props
  }: {
    setErrors: React.Dispatch<React.SetStateAction<string[]>>;
  } & RegisterProps) => {
    await csrf(); // Ensure CSRF token is fetched

    setErrors([]); // Clear previous errors

    axios
      .post("/register", props)
      .then(() => mutate()) // Refresh data
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors); // Set validation errors
      });
  };

  const sellerRegister = async ({
    setErrors,
    ...props
  }: {
    setErrors: React.Dispatch<React.SetStateAction<string[]>>;
  }) => {
    await csrf();
    setErrors([]); // Clear previous errors
  };

  // const login = async ({
  //   setErrors,
  //   setStatus,
  //   email,
  //   password,
  //   remember,
  // }: {
  //   setErrors: any;
  //   setStatus: any;
  //   email: string;
  //   password: string;
  //   remember: boolean;
  // }) => {
  //   await csrf();

  //   setErrors([]);
  //   setStatus(null);

  //   axios
  //     .post("/login", { email, password, remember })
  //     .then(() => mutate())
  //     .catch((error) => {
  //       if (error.response.status !== 422) throw error;

  //       setErrors(error.response.data.errors);
  //     });
  // };

  const login = async ({
    setErrors,
    setStatus,
    email,
    password,
    remember,
  }: {
    setErrors: any;
    setStatus: any;
    email: string;
    password: string;
    remember: boolean;
  }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    const response = axios.post("/login", { email, password, remember });
    return response
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };
  const forgotPassword = async ({
    setErrors,
    setStatus,
    email,
  }: {
    setErrors: any;
    setStatus: any;
    email: any;
  }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resetPassword = async ({
    setErrors,
    setStatus,
    ...props
  }: {
    setErrors: any;
    setStatus: any;
  }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({ setStatus }: { setStatus: any }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    storeFoodCategories: storeFoodCategoriesService,
    getFoodCategories: getFoodCategoiresService,
    getMyCart: getCartItemsService,
    storeWaiter: storeWaiterService,
    makeTablePayment: saveBookPaymentService,
    getWaiters: getWaitersService,
    getBookedTables:getBookTablesService
  };
};
