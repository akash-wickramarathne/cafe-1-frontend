"use client";
import React, { useEffect, useState } from "react";

const Header2 = () => {
  const [header, setHeader] = useState(false);

  const scrollHeader = () => {
    if (window.scrollY >= 20) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);

    return () => {
      window.addEventListener("scroll", scrollHeader);
    };
  }, []);
  return (
    <div
      className={header ? "fixed w-full bg-slate-100 z-50" : "bg-transparent"}
    >
      <div className="header flex w-[80%] justify-between items-center m-auto py-[15px]">
        {/* Left Side - Logo and Name */}
        <div className="flex items-center">
          <img src="/logo.svg" alt="Logo" className="h-10 mr-2" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
            The Galaxy Cafe
          </h1>
        </div>

        {/* Right Side - Navigation */}
        <nav className="flex space-x-9 justify-center text-blue-600 items-center">
          <a href="#menu" className="hover:underline">
            Menu
          </a>
          <a href="#meals" className="hover:underline">
            Meals
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
          <a href="#contact" className="hover:underline">
            Contact
          </a>
          <a href="#login" className="hover:underline">
            Login
          </a>
          <button className="bg-white text-red-600 px-4 py-2 rounded">
            User
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Header2;
