"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export const AdminLeftSideBar = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState("");

  // Ensure router is ready before using it
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: "Item 1",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: "/admin/about",
      label: "Item 2",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: "/admin/contact",
      label: "Item 3",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <div>
      <ul className="menu bg-base-200 rounded-box w-56">
        {menuItems.map(({ href, label, icon }) => (
          <li
            key={href}
            className={currentPath === href ? "bg-blue-500 text-white" : ""}
          >
            <a href={href} className="flex items-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={icon}
                />
              </svg>
              <span className="ml-2">{label}</span>
            </a>
          </li>
        ))}
        <div>{pathname}</div>
      </ul>
    </div>
  );
};
