// app/(app)/admin/[slug]/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/router";
import NotFound from "@/app/(app)/notfound";

const Page = ({ params }: { params: { slug: string } }) => {
  //  const router = useRouter();
  const { slug } = params;

  // Define your valid slugs here
  const validSlugs = ["add"];

  if (!validSlugs.includes(slug)) {
    return (
      <div
        style={{ height: "calc(100vh - 80px)" }}
        className="flex justify-center items-center"
      >
        <NotFound />
      </div>
    );
  }

  // Render your actual page content for valid slugs
  return (
    <div>
      <h1>{slug} Page</h1>
      {/* Render other content based on slug */}
    </div>
  );
};

export default Page;
