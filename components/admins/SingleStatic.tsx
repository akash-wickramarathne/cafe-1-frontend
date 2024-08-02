import Image from "next/image";
import React from "react";

const SingleStatic = ({ title, data, imageSrc }: any) => {
  return (
    <div className="relative p-4 bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Title */}
      <h1 className="text-xl font-semibold mb-4">{title}</h1>

      <div className="grid grid-cols-2">
        <div className="flex items-center justify-center h-32">
          <p className="text-3xl text-blue-600 font-bold antialiased ">
            {data}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Image
            src={imageSrc}
            width={150}
            height={150}
            alt="Decorative"
            className="rounded-full w-50 h-50 object-scale-down"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleStatic;
