// app/admin/projects/layout.tsx
"use client";
import React from "react";
const ProjectsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header>Projects Header</header>
      <main>{children}</main>
    </div>
  );
};

export default ProjectsLayout;
