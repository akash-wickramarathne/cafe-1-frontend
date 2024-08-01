"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Use usePathname for getting the current pathname
import DotLoader from "react-spinners/DotLoader";

export const adminRoutes = [
  "/admin/dashboard",
  "/admin/orders",
  "/admin/projects",
  "/admin/projects/web-design",
];

const SubRootWrapper = ({ children }: any) => {
  const pathname = usePathname(); // Get the current pathname
//   const [isLoading, setIsLoading] = useState(true); // State to handle loading

//   useEffect(() => {
//     // Simulate a loading delay
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000); // Adjust the delay as needed

//     return () => clearTimeout(timer); // Cleanup the timer on unmount
//   }, []);

  // Check if the current pathname is in adminRoutes
  const isAdminRoute = adminRoutes.includes(pathname);

//   if (isLoading) {
//     return <DotLoader />; // Show loader while loading
//   }

  if (!isAdminRoute) {
    return <div>Page Not Found</div>; // Return "not found" message if route is not found
  }

  return <>{children}</>; // Render children if route is found
};

export default SubRootWrapper;
