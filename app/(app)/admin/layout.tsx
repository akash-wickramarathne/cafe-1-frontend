// components/AdminLayout.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AdminNavbar } from "@/components/admins/Header";
import { AdminLeftSideBar } from "@/components/admins/LeftSideBar";
import HeaderMobile from "@/components/admins/Header-Mobile";
import SideNav from "@/components/admins/side-nav";
import PageWrapper from "@/components/page-wrapper";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import AdminWrapper from "../(wrappers)/AdminWrapper";
import SubRootWrapper from "../(wrappers)/CheckSubRootWrapper";

const AdminLayout = ({ children }: any) => {
  return (
    // <div className="flex h-screen">
    //   <div className="bg-gray-900 w-auto ">
    //     <AdminLeftSideBar />
    //   </div>
    //   <div className="flex flex-col w-screen">
    //     <div className="bg-red-700">
    //       <AdminNavbar />
    //     </div>
    //     <div className="flex-1 overflow-auto">{children}</div>
    //   </div>
    // </div>
    <AdminWrapper>
      <div className="flex">
        <SideNav />
        <main className="flex-1">
          <MarginWidthWrapper>
            <AdminNavbar />
            <HeaderMobile />

            <PageWrapper>{children}</PageWrapper>
          </MarginWidthWrapper>
        </main>
      </div>
    </AdminWrapper>
  ); // Render children if not redirected
};

export default AdminLayout;
