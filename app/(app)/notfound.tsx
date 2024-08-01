// app/(app)/NotFound.tsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../public/not-founds/not-found1.json";

const NotFound = () => {
  return (
    <div className="w-[200px]">
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default NotFound;
