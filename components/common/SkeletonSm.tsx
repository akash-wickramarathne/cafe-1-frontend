"use client";

import { Skeleton } from "../ui/skeleton";

export function SkeletonSm({ length }: { length: number }) {
  return (
    <div className="w-10/12 flex flex-col gap-y-10 gap-x-6 ">
      {Array(length)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="flex items-center space-x-4 ">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-300 " />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-[250px] bg-slate-400 " />
              <Skeleton className="h-4 w-10/12 bg-slate-400 " />
            </div>
          </div>
        ))}
    </div>
  );
}
