// app/(app)/admin/[slug]/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/router";
import NotFound from "../../notfound";

const Page = ({ params }: { params: { slug: string } }) => {
  //  const router = useRouter();
  const { slug } = params;

  // Define your valid slugs here
  const validSlugs = ["about", "orders"];

  if (!validSlugs.includes(slug)) {
    return <NotFound />;
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
