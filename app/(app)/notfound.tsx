// app/(app)/NotFound.tsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../public/not-founds/not-found1.json";
import { cn } from "@/lib/utils";

// const NotFound = ({className}:{className:string}) => {
//   return (
//     <div className={cn(className)}>
//       <Lottie animationData={animationData} loop={true} />
//     </div>
//   );
// };

interface NotFoundProps {
  className?: string; // Mark className as optional
}

const NotFound: React.FC<NotFoundProps> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default NotFound;
